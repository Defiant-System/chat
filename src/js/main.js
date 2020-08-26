
let room = "room-1";

const chat = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			output: window.find(".output-body"),
			input: window.find(".input > div"),
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
					message = $.emoticons(Self.els.input.text());

					// send to chat room
					window.net.send({ room, message });

					// clear input
					Self.els.input.html("");
				}
				break;
			case "net.greet":
			case "net.join":
			case "net.leave":
				console.log(event);
				break;
			case "net.message":
				// test to see ui for received messages
				name = event.from === defiant.user.username ? "sent" : "received";
				Self.els.output.append(`<div class="message ${name}">${event.message}</div>`);
				// auto scroll down
				Self.els.output.scrollTop(Self.els.output[0].scrollHeight);
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
