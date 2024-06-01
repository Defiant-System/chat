
@import "modules/transmit.js";
@import "modules/giphy.js";
@import "modules/board.js";
@import "modules/test.js";


let Mod = {
		"/board": Board,
		"/file": Transmit,
		"/giphy": Giphy,
	};


let defaultSettings = {
		"ui-theme": "default",
	};


const ME = karaqu.user;

const chat = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			input: window.find(".transcript .input > div"),
		};

		// init settings
		this.dispatch({ type: "init-settings" });

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
				// save settings
				window.settings.setItem("settings", Self.settings);
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
			case "init-settings":
				// get settings, if any
				Self.settings = window.settings.getItem("settings") || defaultSettings;

				// apply settings
				for (let key in Self.settings) {
					let type = "set-"+ key,
						arg = Self.settings[key];
					// call dispatch
					Self.dispatch({ type, arg });

					// update menu
					window.bluePrint.selectNodes(`//Menu[@click="${type}"]`).map(xMenu => {
						let xArg = xMenu.getAttribute("arg");
						if (xArg === arg || +xArg === +arg) xMenu.setAttribute("is-checked", 1);
						else xMenu.removeAttribute("is-checked");
					});
				}
				break;
			case "set-ui-theme":
				Self.els.content.data({ theme: event.arg });
				// update settings
				Self.settings["ui-theme"] = event.arg;
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
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
	toolbar:    @import "areas/toolbar.js",
	teams:      @import "areas/teams.js",
	threads:    @import "areas/threads.js",
	transcript: @import "areas/transcript.js",
	input:      @import "areas/input.js",
	info:       @import "areas/info.js",
};

window.exports = chat;
