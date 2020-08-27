
{
	init() {
		// fast references
		this.els = {
			root: window.find(".info"),
		};

		// render transcript
		window.render({
			template: "info",
			match: `//Teams`,
			target: this.els.root
		});
	},
	dispatch(event) {
		let Self = chat.info,
			value,
			el;
		switch (event.type) {
			case "toggle-view":
				value = Self.els.root.hasClass("hidden");
				Self.els.root.toggleClass("hidden", value);
				break;
		}
	}
}
