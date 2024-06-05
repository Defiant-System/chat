
// chat.threads

{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			threadsList: window.find(".threads-list"),
		};

		// get friends list from system
		this.dispatch({ type: "get-friends-list" });

		// listen to system event
		window.on("sys:friend-status", this.dispatch);
		window.on("sys:friend-added", this.dispatch);
		window.on("sys:friend-removed", this.dispatch);
	},
	idChannel(id) {
		// team is first
		let parts = id.split("-"),
			team = parts.shift();
		// sort parts alphabeticaly
		parts = parts.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
		// reaturn true ID
		return [team, ...parts].join("-");
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.threads,
			xParent, xNode,
			user, online,
			num, str, file,
			id,
			el;
		// console.log(event);
		switch (event.type) {
			// subscribed events
			case "get-friends-list":
				// friends root node
				Self.xFriends = window.bluePrint.selectSingleNode(`//Team[@id="friends"]`);
				// add "me" to friends list
				id = Self.idChannel(`friends-${ME.username}`);
				user = $.nodeFromString(`<i online="1" me="true" username="${ME.username}" name="${ME.name}" id="${id}"/>`);
				Self.xFriends.appendChild(user);

				// get friends list (array)
				karaqu.shell(`user -f`)
					.then(resp => {
						resp.result.map(friend => Self.dispatch({ type: "x-populate-friend-roster", friend }));
					});
				break;
			case "friend-status":
				el = Self.els.root.find(`.friend[data-username="${event.detail.username}"]`);
				el.toggleClass("online", event.detail.status !== 1);
				// adjust modules attached to user, if needed
				APP.transcript.dispatch({ type: "module-user-status", user: event.detail });
				// update "info", of user status (if it might be showing user info)
				APP.info.dispatch({ ...event.detail, type: "update-user-status" });
				break;
			case "friend-added":
				// add new friend to "local" friend roster
				karaqu.shell(`user -i '${event.detail.username}'`)
					.then(resp => {
						Self.dispatch({ type: "x-populate-friend-roster", friend: resp.result });

						// if friends list is visible, attempt to add user to list
						if (Self.els.threadsList.find(".friends-list").length) {
							// render channels
							let vdom = window.render({
									template: "threads",
									match: `//Teams/Team[@id="friends"]`,
									vdom: true
								}),
								vEl = vdom.find(`li.friend[data-username="${event.detail.username}"]`);
							// insert new friend at "index"
							Self.els.threadsList.find(`li.friend:nth(${vEl.index()-1})`).after(vEl);
						}
					});
				break;
			case "friend-removed":
				// remove friend from "local" data
				user = Self.xFriends.selectSingleNode(`./*[@username="${event.detail.username}"]`);
				if (user) user.parentNode.removeChild(user);
				// remove from view
				el = Self.els.threadsList.find(`.friends-list .friend[data-username="${event.detail.username}"]`);
				user = el.hasClass("active");
				// remove friend from UI
				el.remove();
				// if friend is active now, click on another friend
				if (user) Self.els.threadsList.find(`.friends-list .friend`).trigger("click");

				// TODO: delete logs from "//Data" ??
				break;

			// lobby events
			case "net.greet":
				// add user to app data
				event.list.map(username => {
					Self.dispatch({ type: "x-populate-member-roster", member: { username, team: event.room } });
				});
				// update UI
				Self.dispatch({ type: "ui-populate-member-roster", room: event.room });
				break;
			case "net.join":
				Self.dispatch({ type: "x-populate-member-roster", member: { username: event.from, team: event.room } });
				// update UI
				Self.dispatch({ type: "ui-populate-member-roster", room: event.room });
				break;
			case "net.leave":
				// remove node from data
				id = Self.idChannel(`${event.room}-${event.from}-${ME.username}`);
				xParent = window.bluePrint.selectSingleNode(`//Teams/Team[@id = "${event.room}"]/Members`);
				xNode = xParent.selectSingleNode(`./*[@id="${id}"]`);
				if (xParent && xNode) xParent.removeChild(xNode);

				// UI update if "team" is active
				if (APP.room.id === event.room) {
					Self.els.threadsList.find(`.members-list li[data-id="${id}"]`).remove();

					// TODO: remove all logs of chat with user?
				}
				break;

			// custom events
			case "ui-populate-member-roster":
				// UI update if "team" is active
				if (APP.room.id === event.room) {
					// render member
					let pEl = Self.els.threadsList.find(".members-list ul"),
						vdom = window.render({
							template: "members",
							match: `//Teams/Team[@id="${event.room}"]/Members`,
							vdom: true,
						});
					// add members, if there are not in list already
					vdom.find(".member").map(el => {
						let mEl = $(el);
						if (!pEl.find(`.member[data-id="${mEl.data("id")}"]`).length) {
							if (mEl.index() - 1 < 0) pEl.append(el);
							else pEl.find(`li:nth(${mEl.index()-1})`).after(el);
						}
					});
				}
				break;

			case "x-populate-member-roster":
				xParent = window.bluePrint.selectSingleNode(`//Teams/Team[@id = "${event.member.team}"]/Members`);
				id = Self.idChannel(`${event.member.team}-${event.member.username}-${ME.username}`);
				xNode = $.nodeFromString(`<i id="${id}" username="${event.member.username}"/>`);
				if (!xParent.selectSingleNode(`./*[@id="${xNode.getAttribute("id")}"]`)) xParent.appendChild(xNode);
				break;
			case "x-populate-friend-roster":
				online = event.friend.online ? 1 : 0;
				id = Self.idChannel(`friends-${event.friend.username}-${ME.username}`);
				str = `<i id="${id}" online="${online}" username="${event.friend.username}" name="${event.friend.name}"/>`;
				xNode = $.nodeFromString(str);
				if (!Self.xFriends.selectSingleNode(`./*[@id="${xNode.getAttribute("id")}"]`)) Self.xFriends.appendChild(xNode);
				break;
			case "add-friend":
				karaqu.shell("sys -o");
				break;
			case "select-thread":
				Self.els.root.find(".active").removeClass("active");
				// make clicked item active
				event.el.addClass("active");

				// store channel info
				APP.channel = {
					id: event.el.data("id"),
					username: event.el.data("username"),
				};
				// render channel transcript history
				APP.transcript.dispatch({ type: "render-thread" });
				// forward event to threads column
				APP.info.dispatch({ type: "render-user", username: APP.channel.username });
				break;
			case "render-threads":
				// render channels
				window.render({
					template: "threads",
					match: `//Teams/Team[@id="${event.id}"]`,
					target: Self.els.threadsList
				});
				
				if (event.id === "friends") {
					el = Self.els.root.find(`ul li.online:nth(0)`);
					if (!el.length) el = Self.els.root.find(`ul li:nth(0)`);
					el.trigger("click");
				} else {
					Self.els.root.find(".channel").get(0).trigger("click");
				}
				break;
			case "receive-message":
				// if message is received while app was not started
				if (event.action === "initiate" && !Self.els.threadsList.find(`li[data-id]`).length) {
					// finish initating app first
					APP.dispatch({ type: "window.init" });
					// go to correct channelID
					setTimeout(() => Self.els.threadsList.find(`li[data-id="${event.channelId}"]`).trigger("click"), 100);
				}
				// pre-process message
				if (event.priority === 1) {
					el = Self.els.root.find(`.friend[data-id="${event.channelId}"]`);

					if (el.hasClass("active")) {
						el = APP.transcript.els.output;
						if (event.typing && event.from !== ME.username) {
							// remove existing typing anim, if exist
							el.find(".message.typing").remove();

							str = window.render({ template: "typing" });
							user = karaqu.user.friend(event.from);
							el.append(str.replace(/placeholder/, user.short));
							// remove potential "zombies"
							setTimeout(() => el.find(".message.typing")
								.cssSequence("removing", "transitionend", e => e.remove()), 10e3);
						} else {
							el.find(".message.typing")
								.cssSequence("removing", "transitionend", e => e.remove());
						}
					} else {
						if (event.typing && event.from !== ME.username) {
							// remove existing typing anim, if exist
							el.find(".anim-typing").remove();

							str = window.render({ template: "tiny-typing" });
							el.append(str);
							// remove potential "zombies"
							setTimeout(() => el.find(".anim-typing").remove(), 10e3);
						} else {
							el.find(".anim-typing").remove();
						}
					}
					return;
				}
				// nothing to do - probably "silent" event
				if (!event.message) return;

				let mod = event.message.match(/^\/\w+/);
				if (mod) {
					let cmd = mod[0].trim(),
						str = event.message.slice(cmd.length).trim(),
						node = Mod[cmd] ? Mod[cmd].translate(str) : null;
					if (node.constructor !== String) {
						// adjust event object
						event.module = { cmd, node };
					}
				}

				// log incoming message
				num = APP.transcript.dispatch({ ...event, type: "log-message" });


				if (event.priority === 3) {
					if (ME.username !== event.from) {
						// module message related info
						let data = JSON.parse(event.message),
							xnode = APP.transcript.xTranscripts.selectSingleNode(`.//*[@id="${data.id}"]`),
							// render message content
							message = window.render({
								template: "msg-transmit",
								match: `//Transcripts//*[@cstamp="${xnode.parentNode.getAttribute("cstamp")}"]`,
								vdom: true,
							});
						// replace message content, if in view
						el = APP.transcript.els.output.find(`div[data-id="${data.id}"]`);
						if (el.length) {
							// replace message content
							el.replace(message.html());
							// scroll to bottom
							APP.transcript.els.root.scrollTop(APP.transcript.els.output.height());
						}

						// start transmitting file
						if (data.state === "accept") {
							// get file to send by reference id
							file = APP.transcript._file[data.id];
							// prepare receiver
							user = karaqu.user.friend(event.from);
							user.uuid = data.uuid;
							// establish p2p connection & send file
							APP.peer.connect();
							APP.peer.sendFile(user, file, data.id);
						}
						return;
					}

					if (ME.username === event.from) {
						// console.log( "peer connect", event );
						APP.peer.connect();
					}
				}


				let msgChannelTeam = event.channelId.split("-")[0],
					appChannelTeam = APP.channel.id.split("-")[0];

				// if ([APP.channel.username, ME.username].includes(event.from)) {
				if (APP.channel.id === event.channelId) {
					// forward event for render
					APP.transcript.dispatch(event);
				} else if (event.room && APP.channel.id === event.channelId) {
					// message is to a "team" / room
					APP.transcript.dispatch(event);
				} else if (msgChannelTeam !== appChannelTeam) {
					// UI indicate new message in team
					APP.teams.dispatch({ type: "check-team-unread", id: msgChannelTeam });
				} else {
					// message is to a "team" / room
					el = Self.els.threadsList.find(`li[data-id="${event.channelId}"]`);
					// remove "old" element
					el.find(".notification").remove();
					// append new number
					el.append(`<span class="notification">${num}</span>`);
				}
				break;
		}
	}
}
