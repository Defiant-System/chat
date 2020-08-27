
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
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.teams,
			el;
		switch (event.type) {
			case "select-first-team":
				// auto-select first team
				event.target = Self.els.teams.find(".team:first");
				/* falls through */
			case "select-team":
				Self.els.teams.find(".active").removeClass("active");
				// get clicked team
				el = $(event.target);
				if (!el.hasClass("team")) return;
				// make active
				el.addClass("active");

				// forward event to threads column
				APP.threads.dispatch({ type: "render-team", id: el.data("id") });
				break;
		}
	}
}
