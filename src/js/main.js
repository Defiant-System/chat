
let room = "room-1";

const chat = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());
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
				// join chat room
				window.net.join({ room });
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
			case "net.message":
				Self.transcript.dispatch({ ...event, type: "receive-message" });
				break;
			// custom events
			case "toggle-info":
				value = Self.info.els.root.hasClass("hidden");
				Self.info.els.root.toggleClass("hidden", value);
				break;
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
