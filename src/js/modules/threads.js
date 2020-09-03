
{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			threadsList: window.find(".threads-list"),
			channels: window.find(".threads .channels"),
			members: window.find(".threads .members"),
		};
	},
	idChannel(team, from, to) {
		// channel id based upon "from" and "to"
		return [team].concat([from, to].sort((a, b) => a === b ? 0 : a < b ? -1 : 1)).join("-");
	},
	getValueofContact(username, attr) {
		let user = window.bluePrint.selectSingleNode(`//Team[@id="contacts"]//i[@id="${username}"]`);
		if (user) return user.getAttribute(attr);
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.threads,
			xpath,
			channel,
			team,
			username,
			str,
			el;
		switch (event.type) {
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
				break;
			case "receive-message":
				// log message
				event.channel = Self.idChannel(event.team, event.from, event.to);
				// pre-process message
				if (event.taxonomy === "typing") {
					el = Self.els.root.find(`.friend[data-id="${event.team}/${event.from}"]`);

					if (el.hasClass("active")) {
						el = APP.transcript.els.output;
						if (event.typing && event.from !== ME) {
							// remove existing typing anim, if exist
							el.find(".message.typing").remove();

							str = window.render({ template: "typing" });
							username = Self.getValueofContact(event.from, "short");
							el.append(str.replace(/placeholder/, username));
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

				// temp
				let users = {
						hbi: 0,
						steve: 1,
						bill: 1
					},
					n = users[ME];

				// auto-click first thread
				el = Self.els.root.find("ul li").get(n);
				if (!el.prop("className").startsWith("add-")) {
					el.trigger("click");
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
