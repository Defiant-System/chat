
// chat.transcript

{
	init() {
		// fast references
		this.els = {
			root: window.find(".output"),
			output: window.find(".output-body"),
			input: window.find(".input > div"),
		};
		// reference to root xml node
		this.xTranscripts = window.bluePrint.selectSingleNode("//Transcripts");
		// bind event handlers
		this.els.output.on("mousedown", this.dispatch);
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.transcript,
			message,
			channelId,
			xChannel,
			xpath,
			xnode,
			data,
			modEl, name,
			el;
		// console.log(event);
		switch (event.type) {
			// native events
			case "mousedown":
				modEl = $(event.target).parents("[data-module]");
				if (modEl.length) {
					if (Mod[`/${name}`] && Mod[`/${name}`].dispatch) {
						// prevent default behaviour
						event.preventDefault();
						// proxy event
						return Mod[`/${name}`].dispatch(event);
					}
				}
				break;
			// custom events
			case "render-thread":
				// fix timestamps
				Self.dispatch({ type: "fix-timestamps" });

				// remove unread flags
				channelId = event.channelId || APP.channel.id;
				Self.xTranscripts.selectNodes(`./i[@id="${channelId}"]/*[@unread="1"]`)
					.map(xMsg => xMsg.removeAttribute("unread"));

				// render transcript
				xpath = `//Data/Transcripts/i[@id="${channelId}"]`;
				xChannel = window.bluePrint.selectSingleNode(xpath);
				window.render({
					template: xChannel ? "transcripts" : "empty-channel",
					match: xChannel ? xpath : "//Data",
					target: Self.els.output,
					markup: true,
				});

				// remove potential notification
				setTimeout(() => {
						// remove notification indicator from "thread" element
						APP.threads.els.threadsList.find(`li[data-id="${channelId}"] .notification`).remove();
						// UI indicate new message in team
						APP.teams.dispatch({ type: "check-team-unread", id: channelId.split("-")[0] });
					}, 300);
				break;
			case "focus-message":
				el = $(event.target);
				if (el.data("no-focus")) return;

				// remove previous focus
				message = Self.els.root.find(".focused").removeClass("focused");

				// focus clicked message
				if (!el.hasClass("message")) {
					el = el.parents(".message");
				}
				// don't focus if it was focused
				if (message[0] === el[0]) return;
				// focus
				el.addClass("focused");
				break;
			case "receive-message":
				// this is an internal module notification originated from "this user".
				if (ME.username === event.from && event.priority === 3) return;

				// remove "typing" animations, if exist
				Self.els.output.find(".message.typing").remove();
				// render and append HTML to output
				xpath = `//Transcripts/i[@id="${event.channelId}"]`;
				el = window.render({
						template: "message",
						match: `${xpath}/*[last()]`,
						append: Self.els.output,
						markup: true,
					}).addClass("new-message");

				// bubble-pop animation
				setTimeout(() => el.cssSequence("appear", "transitionend", el => el.removeClass("appear bubble-pop new-message")), 1);

				// remove unread flags
				Self.xTranscripts.selectNodes(`./i[@id="${event.channelId}"]/*[@unread="1"]`)
					.map(xMsg => xMsg.removeAttribute("unread"));

				// remove initial (first/empty channel) message, if any
				Self.els.output.find(".initial-message").remove();
				// scroll to bottom
				Self.els.root.scrollTop(Self.els.output.height());

				// temp
				if (ME.username === "linus" && event.message.startsWith("/file ")) {
					// console.log(event);

					/*
					let curr = 0,
						total = 100,
						fnCount = () => {
							if (curr++ < 100) setTimeout(fnCount, 20);

							console.log(curr);

							// send state update to friend
							// APP.input.dispatch({
							// 	type: "silent-message",
							// 	from: ME.username,
							// 	to: APP.channel.username,
							// 	channelId: APP.channel.id,
							// 	message: JSON.stringify(data),
							// });
						};
					fnCount();
					*/

					// temp: auto-accept file
					setTimeout(() => {
						Self.els.output.find(".transmit-options .btn-accept").trigger("click");
					}, 500);
				}
				break;
			
			// module related events
			case "module-user-status":
				if (event.user.status != 1) {
					// cancel all ongoing file transmits AND inquiries
					channelId = APP.threads.idChannel(`friends-${ME.username}-${event.user.username}`);
					xpath = `./i[@id = "${channelId}"]//file[@status = "accept" or @status = "inquiry"]`;
					Self.xTranscripts.selectNodes(xpath).map(xFile => {
						// auto "cancel" file
						xFile.setAttribute("status", "cancel");
						// update message if in UI
						let mEl = Self.els.output.find(`.file-transmit[data-id="${xFile.getAttribute("id")}"]`);
						if (mEl.length) {
							let message = window.render({
									template: "msg-transmit",
									match: `//Transcripts//*[@cstamp="${xFile.parentNode.getAttribute("cstamp")}"]`,
									vdom: true,
							});
							// replace message content
							mEl.replace(message[0]);
						}
					});
				}
				break;
			case "module-peer-progress":
				// xnode = Self.xTranscripts.selectSingleNode(`.//*[@id="${event.data.uid}"]`);
				// xnode.setAttribute("size", event.data.size);
				// xnode.setAttribute("throughput", event.data.throughput);

				let fsize = event.data.type === "send" ? event.data.bytesToSend : event.data.bytesToReceive,
					perc = Math.round((event.data.size / fsize) * 100),
					sent = karaqu.formatBytes(event.data.size),
					total = karaqu.formatBytes(fsize),
					time = `2.3 minutes`;
				// xnode.setAttribute("perc", perc);

				// UI update
				Self.els.output
					.find(`.file-transmit[data-id="${event.data.uid}"] .transmit-body`)
					.css({ "--perc": `${perc}%`, "--sent": `'${sent}'`, "--total": `'${total}'`, "--time": `'${time}'` });
				break;
			case "module-message-next":
				data = { id: event.el.data("id"), state: event.next };
				xnode = Self.xTranscripts.selectSingleNode(`.//*[@id="${data.id}"]`);
				xnode.setAttribute("status", data.state);
				console.log(xnode);

				// send peer-id if accepted
				if (data.state === "accept") data.uuid = window.peer.id;

				// temp
				if (event.next === "done") return;

				message = window.render({
					template: "msg-transmit",
					match: `//Transcripts//*[@cstamp="${xnode.parentNode.getAttribute("cstamp")}"]`,
					vdom: true,
				});
				// replace message content
				event.el.replace(message[0]);

				// send state update to friend
				APP.input.dispatch({
					type: "silent-message",
					from: ME.username,
					to: APP.channel.username,
					channelId: APP.channel.id,
					message: JSON.stringify(data),
				});
				break;

			case "log-message":
				// create node entry
				xnode = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" unread="1"/>`);
				if (event.priority === 3) {
					data = JSON.parse(event.message);
					// internal module coms
					xnode = Self.xTranscripts.selectSingleNode(`.//*[@id="${data.id}"]`);
					if (!xnode) throw "sync error";
					xnode.setAttribute("status", data.state);
					xnode.parentNode.setAttribute("unread", 1);
					// reset reference to node
					xnode = null;
				} else if (event.module) {
					xnode.setAttribute("type", event.module.cmd.slice(1));
					xnode.appendChild(event.module.node);
				} else {
					xnode.appendChild($.cDataFromString(event.message.escapeHtml()));
				}
				// append node entry to room transcript
				xpath = `i[@id="${event.channelId}"]`;
				xChannel = Self.xTranscripts.selectSingleNode(xpath);
				if (!xChannel) {
					xChannel = Self.xTranscripts.appendChild($.nodeFromString(`<i id="${event.channelId}" />`));
				}
				// add message node to XML log
				if (xnode) xChannel.append(xnode);

				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channelId: event.channelId });
				
				// number of unread messages in thread-log
				return xChannel.selectNodes(`./*[@unread="1"]`).length;
			case "fix-timestamps":
				// fix timestamps
				xpath = `//Transcripts//*[@cstamp and not(@timestamp)]`;
				// xpath = `//Transcripts/*[@id="${APP.channel.id}"]//*[@cstamp and not(@timestamp)]`;
				window.bluePrint.selectNodes(xpath).map(i => {
					let timestamp = new karaqu.Moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});
				break;
			default:
				// if (!event.el) return;
				modEl = event.el.parents("[data-module]");
				if (modEl.length) {
					name = modEl.data("module");
					if (Mod[`/${name}`] && Mod[`/${name}`].dispatch) {
						Mod[`/${name}`].dispatch(event);
					}
				}
		}
	}
}
