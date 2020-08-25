
{
	init() {
		// fast references
		this.els = {
			info: window.find(".info"),
		};

		// render transcript
		window.render({
			template: "info",
			match: `//Teams`,
			target: this.els.info
		});
	},
	dispatch(event) {
		let Self = chat.info,
			el;
		switch (event.type) {
			case "some-event":
				break;
		}
	}
}
