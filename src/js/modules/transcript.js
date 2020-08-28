
{
	init() {
		// fast references
		this.els = {
			root: window.find(".output-body"),
			output: window.find(".output-body"),
			input: window.find(".input > div"),
		};
	},
	dispatch(event) {
		let Self = chat.transcript,
			xpath,
			room,
			message,
			el;
		switch (event.type) {
			// system events
			case "send-message":
				message = $.emoticons(Self.els.input.text());
				// send to chat room
				window.net.send({ room, message });
				// clear input
				Self.els.input.html("");
				break;
			case "receive-message":
				// test to see ui for received messages
				name = event.from === defiant.user.username ? "sent" : "received";
				Self.els.output.append(`<div class="message ${name}">${event.message}</div>`);
				// auto scroll down
				Self.els.output.scrollTop(Self.els.output[0].scrollHeight);
				break;
			// custom events
			case "focus-message":
				// remove previous focus
				message = Self.els.root.find(".focused").removeClass("focused");

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
			case "render-thread":
				// fix timestamps
				xpath = `//Transcripts/*[@id="${event.id}"]//*[@cstamp and not(@timestamp)]`;
				window.bluePrint.selectNodes(xpath).map(i => {
					let timestamp = defiant.moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});

				// render transcript
				window.render({
					template: "transcripts",
					match: `//Transcripts/i[@id="${event.id}"]`,
					target: Self.els.root
				});
				// auto scroll to bottom
				Self.els.root.scrollTop(Self.els.root[0].scrollHeight);
				break;
		}
	}
}
