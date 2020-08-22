
const chat = {
	init() {
		// fast references
		this.content = window.find("content");
		this.output = window.find(".output-body");
		this.input = window.find(".input > div");

		//defiant.shell("win -a");
	},
	dispatch(event) {
		let Self = chat,
			el;
		switch (event.type) {
			// system events
			case "window.open":
				// join chat room
				defiant.net.join({ room: "test123" });
				break;
			case "window.keystroke":
				if (event.keyCode === 13) {
					to = "hbi99";
					msg = $.emoticons(Self.input.text());
					// test to see ui for received messages
					name = event.shiftKey ? "received" : "sent";
					Self.output.append(`<div class="${name}">${msg}</div>`);

					// send to chat room
					defiant.net.send({
						to,
						msg
					});

					// clear input
					Self.input.html("");
				}
				break;
		}
	}
};

window.exports = chat;
