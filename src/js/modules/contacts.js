
{
	init() {
		// fast references
		this.els = {
			contacts: window.find(".contacts-list"),
		};

		// render transcript
		window.render({
			template: "contacts",
			match: `//Teams/Team[@id="team-id-1"]`,
			target: this.els.contacts
		});
	},
	dispatch(event) {
		let Self = chat.contacts,
			el;
		switch (event.type) {
			case "some-event":
				break;
		}
	}
}
