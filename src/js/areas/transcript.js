
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
				if (ME.username === "linus") console.log(event);

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
				break;
			case "log-message":
				// create node entry
				xnode = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" unread="1"/>`);
				if (event.module) {
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
				xChannel.append(xnode);

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
