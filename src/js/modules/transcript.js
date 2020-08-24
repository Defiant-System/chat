
{
	init() {
		// fast references
		this.els = {
			output: window.find(".output-body"),
		};

		// render transcript
		window.render({
			template: "transcripts",
			match: `//Transcripts/i[@id="team-id-1::chan-1"]`,
			target: this.els.output
		});

		// auto scroll to bottom
		this.els.output.scrollTop(this.els.output[0].scrollHeight);
	},
	dispatch(event) {
		let Self = chat.transcript,
			el;
		switch (event.type) {
			case "some-event":
				break;
		}
	}
}
