
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

		window.bluePrint.selectNodes("//Teams/Team").map(node => {
			let id = node.getAttribute("id"),
				xpath = `//Transcripts/*[contains(@id, "${id}")]//*[@unread]`,
				unread = window.bluePrint.selectNodes(xpath);
			if (unread.length) {
				this.els.teams.find(`.team[data-id="${id}"]`)
					.append(`<span class="notification"></span>`);
			}
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
				// get clicked team
				el = $(event.target);
				if (!el.hasClass("team")) return;
				// de-active previously active
				Self.els.teams.find(".active").removeClass("active");
				// make active
				el.addClass("active");

				// forward event to threads column
				APP.threads.dispatch({ type: "render-team", id: el.data("id") });
				break;
		}
	}
}
