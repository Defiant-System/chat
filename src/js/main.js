
@import "modules/giphy.js";

const ME = defiant.user;

const chat = {
	lobby: "chat-lobby",
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			input: window.find(".transcript .input > div"),
		};

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		// temp
		//window.find(".toolbar-tool_[data-click='toggle-info']").trigger("click");

		//Giphy.search("shalom", res => console.log(res));
	},
	dispatch(event) {
		let Self = chat,
			name,
			value,
			message,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.init":
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
	teams:      @import "modules/teams.js",
	threads:    @import "modules/threads.js",
	transcript: @import "modules/transcript.js",
	input:      @import "modules/input.js",
	info:       @import "modules/info.js",
};

window.exports = chat;
