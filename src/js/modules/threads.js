
{
	init() {
		// fast references
		this.els = {
			channels: window.find(".channels"),
			members: window.find(".members"),
		};

		// render channels
		window.render({
			template: "channels",
			match: `//Teams/Team[@id="team-id-1"]`,
			target: this.els.channels
		});

		// render transcript
		window.render({
			template: "members",
			match: `//Teams/Team[@id="team-id-1"]`,
			target: this.els.members
		});
	},
	dispatch(event) {
		let Self = chat.threads,
			el;
		switch (event.type) {
			case "some-event":
				break;
		}
	}
}
