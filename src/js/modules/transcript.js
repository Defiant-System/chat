
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
			team,
			channel,
			from,
			to,
			stamp,
			message,
			el;
		switch (event.type) {
			// system events
			case "send-message":
				from = ME;
				stamp = Date.now();
				channel = APP.channel.id;
				message = Self.els.input.text();

				// split channel id
				[ team, to ] = channel.split("/");
				// send to chat lobby
				window.net.send({ from, to, channel, stamp, message });
				// clear input
				Self.els.input.html("");
				break;
			case "log-message":
				// create node entry
				node = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" />`);
				node.appendChild($.cDataFromString(event.message.escapeHtml()));
				// append node entry to room transcript
				xpath = `i[@id="${event.channel}"]`;
				xChannel = Self.xTranscripts.selectSingleNode(xpath);
				if (!xChannel) {
					xChannel = Self.xTranscripts.appendChild($.nodeFromString(`<i id="${event.channel}" />`));
				}
				// add message node to XML log
				xChannel.append(node);
				console.log(xChannel);

				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channel: event.channel });
				break;
			case "receive-message":
				// render and append HTML to output
				window.render({
					template: "message",
					match: `//Transcripts/i[@id="${event.channel}"]/*[last()]`,
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
			case "render-channel":
				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channel: APP.channel.id });

				// render transcript
				xpath = `//Transcripts/i[@id="${APP.channel.id}"]`;
				xChannel = window.bluePrint.selectSingleNode(xpath);
				window.render({
					template: xChannel ? "transcripts" : "empty-channel",
					match: xChannel ? xpath : "*",
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
				xpath = `//Transcripts/*[@id="${event.channel}"]//*[@cstamp and not(@timestamp)]`;
				window.bluePrint.selectNodes(xpath).map(i => {
					let timestamp = defiant.moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});
				break;
		}
	}
}
