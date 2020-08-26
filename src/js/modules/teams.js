
{
	init() {
		// fast references
		this.els = {
			teams: window.find(".teams > div"),
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
			case "select-team":
				Self.els.teams.find(".active").removeClass("active");
				// get clicked team
				el = $(event.target);
				if (!el.hasClass("team")) return;
				// make active
				el.addClass("active");
				break;
		}
	}
}
