
let room = "room-1";

const chat = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			teams: window.find(".teams"),
			contacts: window.find(".contacts"),
			output: window.find(".output-body"),
			input: window.find(".input > div"),
			sidebar: window.find(".sidebar"),
		};

		this.els.output.scrollTop(this.els.output[0].scrollHeight);

		//window.settings.get("test");
	},
	dispatch(event) {
		let Self = chat,
			value,
			message,
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
			case "toggle-sidebar":
				value = Self.els.sidebar.hasClass("hidden");
				Self.els.sidebar.toggleClass("hidden", value);
				break;
			case "select-team":
				Self.els.teams.find(".active").removeClass("active");
				// get clicked team
				el = $(event.target);
				if (!el.hasClass("team")) return;
				// make active
				el.addClass("active");
				break;
			case "select-contact":
				break;
			case "focus-message":
				// remove previous focus
				message = Self.els.output.find(".focused").removeClass("focused");

				// focus clicked message
				el = $(event.target);
				if (!el.hasClass("message")) {
					el = el.parents(".message");
				}
				// don't focus if it was focused
				if (message[0] === el[0]) return;
				// focus
				el.addClass("focused");
				break;
		}
	}
};

window.exports = chat;
