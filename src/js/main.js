
defiant.require("modules/giphy.js");

const ME = defiant.user.username;

const chat = {
	lobby: "chat-lobby",
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			input: window.find(".transcript .input > div"),
		};

		// identify "me"
		let meUser = window.bluePrint.selectSingleNode(`//Contacts/*[@id="${ME}"]`);
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
				if (document.activeElement === Self.els.input[0]) {
					Self.input.dispatch(event);
				}
				break;
			case "net.greet":
			case "net.join":
			case "net.leave":
				console.log(event);
				break;
			// forward events
			case "net.receive":
				Self.threads.dispatch({ ...event, type: "receive-message" });
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
	input: defiant.require("modules/input.js"),
	info: defiant.require("modules/info.js"),
};

window.exports = chat;
