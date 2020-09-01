
defiant.require("modules/giphy.js");

const chat = {
	lobby: "chat-lobby",
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

		// identify "me"
		let meUser = window.bluePrint.selectSingleNode(`//Contacts/*[@id="${defiant.user.username}"]`);
		meUser.setAttribute("me", "true");

		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		//Giphy.search("shalom", res => console.log(res));
	},
	dispatch(event) {
		let Self = chat,
			name,
			value,
			message,
			pEl,
			el;
		switch (event.type) {
			// system events
			case "window.open":
				// auto-select first team
				Self.teams.dispatch({ type: "select-first-team" });

				// join chat lobby
			//	window.net.join({ room: Self.lobby });
				break;
			case "window.close":
				// join chat lobby
				window.net.leave({ room: Self.lobby });
				break;
			case "window.keystroke":
				if (event.keyCode === 13) {
					Self.transcript.dispatch({ type: "send-message" });
				}
				break;
			case "net.greet":
			case "net.join":
			case "net.leave":
				console.log(event);
				break;
			case "net.receive":
				Self.transcript.dispatch({ ...event, type: "receive-message" });
				break;
			// custom events
			case "toggle-info":
				return Self.info.dispatch({ ...event, type: "toggle-view" });
			default:
				if (event.el) {
					pEl = event.el.parents("div[data-area]");
					name = pEl.attr("data-area");
					if (pEl.length && Self[name].dispatch) {
						Self[name].dispatch(event);
					}
				}
		}
	},
	teams: defiant.require("modules/teams.js"),
	threads: defiant.require("modules/threads.js"),
	transcript: defiant.require("modules/transcript.js"),
	info: defiant.require("modules/info.js")
};

window.exports = chat;
