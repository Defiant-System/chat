
{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			channels: window.find(".threads .channels"),
			members: window.find(".threads .members"),
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
			case "toggle-channels":
			case "toggle-members":
				el = event.el.parent();
				el.toggleClass("collapsed", el.hasClass("collapsed"));
				break;
			case "add-channel":
				console.log(event);
				break;
			case "add-member":
				console.log(event);
				break;
			case "select-thread":
				Self.els.root.find(".active").removeClass("active");
				
				event.el.addClass("active");
				break;
		}
	}
}
