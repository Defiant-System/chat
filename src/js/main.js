
let room = "room-1";

const Giphy = {
	apiKey: "QeIoDbJPQqdpCofwa2tIl3kZ8erGh1VC",
	async search(phrase, callback) {
		let url = `//api.giphy.com/v1/gifs/search?q=${phrase}&api_key=${this.apiKey}&limit=1`;
		let res = await window.fetch(url);
		callback(res);
	}
};

// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
// xhr.done(function(data) { console.log("success got data", data); });

const chat = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};

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
