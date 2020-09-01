
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
			channel,
			to,
			from,
			stamp,
			message,
			el;
		switch (event.type) {
			// system events
			case "send-message":
				from = defiant.user.username;
				stamp = Date.now();
				message = Self.els.input.text();

				// temp
				to = defiant.user.username === "hbi" ? "hbi99" : "hbi";

				// send to chat lobby
				window.net.send({ from, to, stamp, message });
				// clear input
				Self.els.input.html("");
				break;
			case "receive-message":
				// create node entry
				node = $.nodeFromString(`<i from="${event.from}" cstamp="${event.stamp}" />`);
				node.appendChild($.cDataFromString(event.message.escapeHtml()));

				// create channel based upon "from" and "to"
				channel = [event.from, event.to].sort((a, b) => a === b ? 0 : a < b ? -1 : 1).join("-");
				// append node entry to room transcript
				xpath = `i[@id="${channel}"]`;
				xChannel = Self.xTranscripts.selectSingleNode(xpath);
				if (!xChannel) {
					xChannel = Self.xTranscripts.appendChild($.nodeFromString(`<i id="${channel}" />`));
				}
				xChannel.append(node);

				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channel });
				
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
			case "render-channel":
				// save current channel ID
				Self.currentChannel = event.id;
				// fix timestamps
				Self.dispatch({ type: "fix-timestamps", channel: event.id });

				// render transcript
				xpath = `//Transcripts/i[@id="${event.id}"]`;
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
