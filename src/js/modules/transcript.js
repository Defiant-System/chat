
{
	init() {
		// fast references
		this.els = {
			root: window.find(".output"),
			output: window.find(".output-body"),
			input: window.find(".input > div"),
		};
		this.xTranscripts = window.bluePrint.selectSingleNode("//Transcripts");
	},
	dispatch(event) {
		let Self = chat.transcript,
			xpath,
			node,
			room,
			from,
			stamp,
			message,
			el;
		switch (event.type) {
			// system events
			case "send-message":
				room = Self.currentThreadID;
				from = defiant.user.username;
				stamp = Date.now();
				message = Self.els.input.text();

				// temp
				Self.dispatch({ type: "receive-message", from, room, stamp, message });

				// send to chat room
			//	window.net.send({ room, message });
				// clear input
				Self.els.input.html("");
				break;
			case "receive-message":
				// create node entry
				node = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" />`);
				node.appendChild($.cDataFromString(event.message.escapeHtml()));
				// append node entry to room transcript
				xpath = `i[@id="${event.room}"]`;
				room = Self.xTranscripts.selectSingleNode(xpath);
				if (!room) {
					room = Self.xTranscripts.appendChild($.nodeFromString(`<i id="${Self.currentThreadID}" />`));
				}
				room.append(node);

				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", thread: Self.currentThreadID });
				
				// render and append HTML to output
				window.render({
					template: "message",
					match: xpath +"/*[last()]",
					append: Self.els.output,
					markup: true,
				});
				// remove initial message, if any
				Self.els.output.find(".initial-message").remove();
				// scroll to bottom
				Self.els.root.scrollTop(Self.els.output.height());
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
				// save current thread ID
				Self.currentThreadID = event.id;
				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", thread: event.id });

				// render transcript
				xpath = `//Transcripts/i[@id="${event.id}"]`;
				room = window.bluePrint.selectSingleNode(xpath);
				window.render({
					template: room ? "transcripts" : "empty-room",
					match: room ? xpath : "*",
					target: Self.els.output,
					markup: true,
				});
				// scroll to bottom
				Self.els.root.scrollTop(Self.els.output.height());
				// auto focus input field
				Self.els.input.focus();
				break;
			case "fix-timestamps":
				// fix timestamps
				xpath = `//Transcripts/*[@id="${event.thread}"]//*[@cstamp and not(@timestamp)]`;
				window.bluePrint.selectNodes(xpath).map(i => {
					let timestamp = defiant.moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});
				break;
		}
	}
}
