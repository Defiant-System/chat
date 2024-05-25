
// chat.threads

{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			teams: window.find(".teams"),
			threadsList: window.find(".threads-list"),
			channels: window.find(".threads .channels"),
			members: window.find(".threads .members"),
		};
		
		// listen to system event
		window.on("sys:friend-status", this.dispatch);
		window.on("sys:friend-added", this.dispatch);
		window.on("sys:friend-removed", this.dispatch);
	},
	idChannel(team, from, to) {
		// channel id based upon "from" and "to"
		return [team, from, to].join("-");
		// return [team].concat([from, to].sort((a, b) => a === b ? 0 : a < b ? -1 : 1)).join("-");
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.threads,
			xpath,
			channel,
			team,
			thread,
			user,
			username,
			num, str,
			el;
		// console.log(event);
		switch (event.type) {
			// subscribed events
			case "friend-status":
				el = Self.els.root.find(`.friend[data-id="friends/${event.detail.username}"]`);
				el.toggleClass("online", event.detail.status !== 1);
				break;
			case "friend-added":
				if (Self.els.threadsList.find(".friends-list").length) {
					// render channels
					let vdom = window.render({
							template: "threads",
							match: `//Teams/Team[@id="friends"]`,
							vdom: true
						}),
						vEl = vdom.find(`li.friend[data-id="friends/${event.detail.username}"]`);
					// vdom.find(`li.friend`).map(el => console.log(el));
					// insert new friend at "index"
					Self.els.threadsList.find(`li.friend:nth(${vEl.index()-1})`).after(vEl);
				}
				break;
			case "friend-removed":
				// remove from view
				el = Self.els.threadsList.find(`.friends-list .friend[data-id="friends/${event.detail.username}"]`);
				user = el.hasClass("active");
				// remove friend from UI
				el.remove();
				// if friend is active now, click on another friend
				if (user) Self.els.threadsList.find(`.friends-list .friend`).trigger("click");

				// TODO: delete logs from "//Data" ??
				break;
			// custom events
			case "toggle-channels":
			case "toggle-members":
				el = event.el.parent();
				el.toggleClass("collapsed", el.hasClass("collapsed"));
				break;
			case "add-channel":
			case "add-member":
				console.log(event);
				break;
			case "add-friend":
				karaqu.shell("sys -o");
				break;
			case "select-channel":
				Self.els.root.find(".active").removeClass("active");
				// make clicked item active
				event.el.addClass("active");
				// remove unread notification flags
				Self.dispatch({ ...event, type: "remove-unread"});
				// prepare for next case
				event.channel = event.el.data("id");
				// de-hash channel info
				[ team, username ] = event.channel.split("/");
				// store channel info
				APP.channel = {
					team,
					username,
					el: event.el,
					id: Self.idChannel(team, ME.username, username),
				};
				// render channel transcript history
				APP.transcript.dispatch({ type: "render-channel" });
				// forward event to threads column
				APP.info.dispatch({ type: "render-user", username });
				break;
			case "go-to-channel":
				// de-hash channel info
				[ team, username ] = event.channel.split("/");
				// activate team
				el = Self.els.teams.find(`.team[data-id="${team}"]`);
				if (!el.hasClass("active")) el.trigger("click");
				// activate thread
				thread = Self.els.threadsList.find(`li[data-id="${team}/${username}"]`);
				if (!thread.hasClass("active")) thread.trigger("click");
				break;
			case "receive-message":
				if (event.action === "go-to-channel") {
					return Self.dispatch({
						type: event.action,
						channel: event.channel,
						username: event.from,
					});
				}
				// log message
				event.channel = Self.idChannel(event.team, event.from, event.to);
				// pre-process message
				if (event.priority === 1) {
					el = Self.els.root.find(`.friend[data-id="${event.team}/${event.from}"]`);

					if (el.hasClass("active")) {
						el = APP.transcript.els.output;
						if (event.typing && event.from !== ME.username) {
							// remove existing typing anim, if exist
							el.find(".message.typing").remove();

							str = window.render({ template: "typing" });
							user = karaqu.user.friend(event.from);
							el.append(str.replace(/placeholder/, user.short));
						} else {
							el.find(".message.typing")
								.cssSequence("removing", "transitionend", e => e.remove());
						}
					} else {
						if (event.typing && event.from !== ME.username) {
							str = window.render({ template: "tiny-typing" });
							el.append(str);
						} else {
							el.find(".anim-typing").remove();
						}
					}
					return;
				}
				// log incoming message
				num = APP.transcript.dispatch({ ...event, type: "log-message" });

				if ([APP.channel.username, ME.username].includes(event.from)) {
					// forward event for render
					APP.transcript.dispatch(event);
				} else {
					Self.els.root
						.find(`.friend[data-id="${event.team}/${event.from}"] .notification`)
						.remove();
					Self.els.root
						.find(`.friend[data-id="${event.team}/${event.from}"]`)
						.append(`<span class="notification">${num}</span>`);
				}
				break;
			case "render-team":
				// render channels
				window.render({
					template: "threads",
					match: `//Teams/Team[@id="${event.id}"]`,
					target: Self.els.threadsList
				});
				
				Self.dispatch({ ...event, type: "check-for-unread" });

				if (event.id === "friends") {
					el = Self.els.root.find(`ul li.online:nth(0)`);
					if (!el.length) el = Self.els.root.find(`ul li:nth(0)`);
					el.trigger("click");
				} else {
					Self.els.root.find(".channel").get(0).trigger("click");
				}
				break;
			case "remove-unread":
				// remove potential notification
				setTimeout(() => event.el.find(".notification").remove(), 500);

				xpath = `//Transcripts/*[@id="${event.el.data("id")}"]//*[@unread]`;
				window.bluePrint.selectNodes(xpath).map(node => node.removeAttribute("unread"));
				break;
			case "check-for-unread":
				xpath = `//Teams/Team[@id="${event.id}"]/*/*[@id]`;
				window.bluePrint.selectNodes(xpath).map(node => {
					let id = event.id +"/"+ node.getAttribute("id"),
						xpath = `//Transcripts/*[@id="${id}"]//*[@unread]`,
						unread = window.bluePrint.selectNodes(xpath);
					if (unread.length) {
						Self.els.root.find(`li[data-id="${id}"]`)
							.append(`<span class="notification">${unread.length}</span>`);
					}
				});
				break;
		}
	}
}
