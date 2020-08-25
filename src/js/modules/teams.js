
{
	init() {
		// fast references
		this.els = {
			teams: window.find(".teams"),
		};

		// render transcript
		window.render({
			template: "teams",
			match: `//Teams`,
			target: this.els.teams
		});

		// auto-select first team
		this.els.teams.find(".team:first").trigger("click");
	},
	dispatch(event) {
		let Self = chat.teams,
			el;
		switch (event.type) {
			case "some-event":
				break;
		}
	}
}
