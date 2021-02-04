
{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			threadsList: window.find(".threads-list"),
			channels: window.find(".threads .channels"),
			members: window.find(".threads .members"),
		};
		
		// listen to system event
		defiant.on("sys:friend-status", this.dispatch);
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
			user,
			username,
			num,
			str,
			el;
		switch (event.type) {
			// system events
			case "friend-status":
				el = Self.els.root.find(`.friend[data-id="friends/${event.detail.username}"]`);
				el.toggleClass("online", event.detail.online !== "1");
				break;
			// custom events
			case "toggle-channels":
			case "toggle-members":
				el = event.el.parent();
				el.toggleClass("collapsed", el.hasClass("collapsed"));
				break;
			case "add-channel":
			case "add-member":
			case "add-friend":
				console.log(event);
				break;
			case "select-channel":
				Self.els.root.find(".active").removeClass("active");
				// make clicked item active
				event.el.addClass("active");
				// remove unread notification flags
				Self.dispatch({ ...event, type: "remove-unread"});
				// store channel info
				[ team, username ] = event.el.data("id").split("/");
				APP.channel = {
					team,
					username,
					el: event.el,
					id: Self.idChannel(team, ME, username),
				};
				// render channel transcript history
				APP.transcript.dispatch({ type: "render-channel" });
				// forward event to threads column
				APP.info.dispatch({ type: "render-user", username });
				break;
			case "receive-message":
				// log message
				event.channel = Self.idChannel(event.team, event.from, event.to);
				// pre-process message
				if (event.priority === 2) {
					el = Self.els.root.find(`.friend[data-id="${event.team}/${event.from}"]`);

					if (el.hasClass("active")) {
						el = APP.transcript.els.output;
						if (event.typing && event.from !== ME) {
							// remove existing typing anim, if exist
							el.find(".message.typing").remove();

							str = window.render({ template: "typing" });
							user = defiant.user.friend(event.from);
							el.append(str.replace(/placeholder/, user.short));
						} else {
							el.find(".message.typing")
								.cssSequence("removing", "transitionend", e => e.remove());
						}
					} else {
						if (event.typing && event.from !== ME) {
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

				if ([APP.channel.username, ME].includes(event.from)) {
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
					// temp: auto-click first thread
					let users = {
							hbi: "bill",
							steve: "hbi",
							bill: "hbi"
						},
						friend = users[ME];
					el = Self.els.root.find(`ul li[data-id="friends/${friend}"]`);
					if (!el.prop("className").startsWith("add-")) {
						el.trigger("click");
					}
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
