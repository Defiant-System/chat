
// chat.teams

{
	init() {
		// fast references
		this.els = {
			teams: window.find(".teams > div"),
		};
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.teams,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-teams":
				// render transcript
				window.render({
					template: "teams",
					match: `//Teams`,
					target: Self.els.teams
				});
				break;
			case "select-first-team":
				// auto-select first team
				event.target = Self.els.teams.find(".team:first");
				/* falls through */
			case "select-team":
				// get clicked team
				el = $(event.target);
				if (!el.hasClass("team")) return;
				// de-active previously active
				Self.els.teams.find(".active").removeClass("active");
				// make active
				el.addClass("active");

				// forward event to threads column
				APP.threads.dispatch({ type: "render-threads", id: el.data("id") });
				break;
		}
	}
}
