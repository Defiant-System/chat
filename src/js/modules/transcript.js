
{
	init() {
		// fast references
		this.els = {
			root: window.find(".output-body"),
		};

		// render transcript
		window.render({
			template: "transcripts",
			match: `//Transcripts/i[@id="team-id-1::chan-1"]`,
			target: this.els.root
		});

		// auto scroll to bottom
		this.els.root.scrollTop(this.els.root[0].scrollHeight);
	},
	dispatch(event) {
		let Self = chat.transcript,
			message,
			el;
		switch (event.type) {
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
		}
	}
}
