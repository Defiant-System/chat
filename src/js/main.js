
let room = "room-1";

const chat = {
	init() {
		// fast references
		this.content = window.find("content");
		this.output = window.find(".output-body");
		this.input = window.find(".input > div");

		//window.settings.get("test");
	},
	dispatch(event) {
		let Self = chat,
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
					message = $.emoticons(Self.input.text());

					// send to chat room
					window.net.send({ room, message });

					// clear input
					Self.input.html("");
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
				Self.output.append(`<div class="${name}">${event.message}</div>`);
				//console.log(event);
				break;
		}
	}
};

window.exports = chat;
