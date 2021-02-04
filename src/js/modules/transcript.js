
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
		let APP = chat,
			Self = APP.transcript,
			xChannel,
			xpath,
			node,
			message,
			el;
		switch (event.type) {
			// custom events
			case "log-message":
				// create node entry
				node = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" unread="1"/>`);
				node.appendChild($.cDataFromString(event.message.escapeHtml()));
				// append node entry to room transcript
				xpath = `i[@id="${event.channel}"]`;
				xChannel = Self.xTranscripts.selectSingleNode(xpath);
				if (!xChannel) {
					xChannel = Self.xTranscripts.appendChild($.nodeFromString(`<i id="${event.channel}" />`));
				}
				// add message node to XML log
				xChannel.append(node);

				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channel: event.channel });
				
				// number of unread messages in thread-log
				return xChannel.selectNodes(`./*[@unread="1"]`).length;
			case "receive-message":
				// remove "typing" animations, if exist
				Self.els.output.find(".message.typing").remove();
				// render and append HTML to output
				xpath = `//Transcripts/i[@id="${event.channel}"]`;
				window.render({
					template: "message",
					match: `${xpath}/*[last()]`,
					append: Self.els.output,
					markup: true,
				});
				// remove unread flags
				Self.xTranscripts.selectNodes(`${xpath}/*[@unread="1"]`)
					.map(xMsg => xMsg.removeAttribute("unread"));
				// remove initial message, if any
				Self.els.output.find(".initial-message").remove();
				// scroll to bottom
				Self.els.root.scrollTop(Self.els.output.height());
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
			case "render-channel":
				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channel: APP.channel.id });
				//console.log(APP.channel.id);
				
				// render transcript
				xpath = `//Transcripts/i[@id="${APP.channel.id}"]`;
				xChannel = window.bluePrint.selectSingleNode(xpath);
				window.render({
					template: xChannel ? "transcripts" : "empty-channel",
					match: xChannel ? xpath : "*",
					target: Self.els.output,
					markup: true,
				});
				if (xChannel) {
					// remove unread flags
					xChannel.selectNodes(`./*[@unread="1"]`).map(xMsg => xMsg.removeAttribute("unread"));
				}
				// scroll to bottom
				Self.els.root.scrollTop(Self.els.output.height());
				// auto focus input field
				Self.els.input.focus();
				break;
			case "fix-timestamps":
				// fix timestamps
				xpath = `//Transcripts/*[@id="${event.channel}"]//*[@cstamp and not(@timestamp)]`;
				window.bluePrint.selectNodes(xpath).map(i => {
					let timestamp = new defiant.Moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});
				break;
		}
	}
}
