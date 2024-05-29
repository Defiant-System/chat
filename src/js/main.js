
@import "modules/test.js";


const ME = karaqu.user;

const chat = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			input: window.find(".transcript .input > div"),
		};

		// obtain lobby ID
		let xTeam = window.bluePrint.selectSingleNode(`//Team[@name="Karaqu"]`);
		this.lobbyId = xTeam.getAttribute("id");

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
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
				Self.teams.dispatch({ type: "render-teams" });
				Self.teams.dispatch({ type: "select-first-team" });

				// join chat lobby
				window.net.join({ room: Self.lobbyId });
				break;
			case "window.close":
				// leave chat lobby
				window.net.leave({ room: Self.lobbyId });
				break;
			case "window.keystroke":
				if (document.activeElement === Self.els.input[0]) {
					Self.input.dispatch(event);
				}
				break;
			case "window.blur":
				Self.els.input.blur(); // force release of focus
				break;
			case "window.focus":
				Self.els.input.focus(); // regain focus
				break;

			// lobby events
			case "net.greet":
			case "net.join":
			case "net.leave":
				// proxy event to threads
				return Self.threads.dispatch(event);

			// custom events
			case "set-ui-theme":
				Self.els.content.data({ theme: event.arg });
				break;
			// forward events
			case "net.receive":
				Self.threads.dispatch({ ...event, type: "receive-message" });
				break;
			// custom events
			default:
				if (event.el) {
					pEl = event.el.parents("div[data-area]");
					name = pEl.attr("data-area");
					if (pEl.length && Self[name] && Self[name].dispatch) {
						return Self[name].dispatch(event);
					}
				}
		}
	},
	toolbar:    @import "modules/toolbar.js",
	teams:      @import "modules/teams.js",
	threads:    @import "modules/threads.js",
	transcript: @import "modules/transcript.js",
	input:      @import "modules/input.js",
	info:       @import "modules/info.js",
};

window.exports = chat;
