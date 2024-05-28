
// chat.transcript

{
	init() {
		// fast references
		this.els = {
			root: window.find(".output"),
			output: window.find(".output-body"),
			input: window.find(".input > div"),
		};
		// reference to root xml node
		this.xTranscripts = window.bluePrint.selectSingleNode("//Transcripts");
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.transcript,
			message,
			xChannel,
			xpath,
			xnode,
			el;
		switch (event.type) {
			// custom events
			case "render-thread":
				// fix timestamps
				Self.dispatch({ type: "fix-timestamps" });

				// render transcript
				xpath = `//Data/Transcripts/i[@id="${event.channelId || APP.channel.id}"]`;
				xChannel = window.bluePrint.selectSingleNode(xpath);
				window.render({
					template: xChannel ? "transcripts" : "empty-channel",
					match: xChannel ? xpath : "//Data",
					target: Self.els.output,
					markup: true,
				});
				break;
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

			case "receive-message":
				// remove "typing" animations, if exist
				Self.els.output.find(".message.typing").remove();
				// render and append HTML to output
				xpath = `//Transcripts/i[@id="${event.channelId}"]`;
				el = window.render({
						template: "message",
						match: `${xpath}/*[last()]`,
						append: Self.els.output,
						markup: true,
					}).addClass("new-message");

				// bubble-pop animation
				setTimeout(() => el.cssSequence("appear", "transitionend", el => el.removeClass("appear bubble-pop new-message")), 1);

				// remove unread flags
				Self.xTranscripts.selectNodes(`${xpath}/*[@unread="1"]`)
					.map(xMsg => xMsg.removeAttribute("unread"));
				// remove initial message, if any
				Self.els.output.find(".initial-message").remove();
				// scroll to bottom
				Self.els.root.scrollTop(Self.els.output.height());
				break;

			case "log-message":
				// create node entry
				xnode = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" unread="1"/>`);
				xnode.appendChild($.cDataFromString(event.message.escapeHtml()));
				// append node entry to room transcript
				xpath = `i[@id="${event.channelId}"]`;
				xChannel = Self.xTranscripts.selectSingleNode(xpath);
				if (!xChannel) {
					xChannel = Self.xTranscripts.appendChild($.nodeFromString(`<i id="${event.channelId}" />`));
				}
				// add message node to XML log
				xChannel.append(xnode);

				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channelId: event.channelId });
				
				// number of unread messages in thread-log
				return xChannel.selectNodes(`./*[@unread="1"]`).length;
			case "fix-timestamps":
				// fix timestamps
				xpath = `//Transcripts/*[@id="${APP.channel.id}"]//*[@cstamp and not(@timestamp)]`;
				window.bluePrint.selectNodes(xpath).map(i => {
					let timestamp = new karaqu.Moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});
		}
	}
}
