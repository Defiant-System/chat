
{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			channels: window.find(".threads .channels"),
			members: window.find(".threads .members"),
		};

		// fix timestamps
		this.dispatch({ type: "fix-timestamps" });

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
		let APP = chat,
			Self = APP.threads,
			id,
			el;
		switch (event.type) {
			case "toggle-channels":
			case "toggle-members":
				el = event.el.parent();
				el.toggleClass("collapsed", el.hasClass("collapsed"));
				break;
			case "add-channel":
			case "add-member":
				console.log(event);
				break;
			case "select-thread":
				Self.els.root.find(".active").removeClass("active");
				// make clicked item active
				event.el.addClass("active");

				id = event.el.data("id");
				APP.transcript.dispatch({ type: "render-thread", id });
				break;
			case "fix-timestamps":
				window.bluePrint.selectNodes("//*[@cstamp and not(@timestamp)]").map(i => {
					let timestamp = defiant.moment(+i.getAttribute("cstamp"));
					i.setAttribute("timestamp", timestamp.format("ddd D MMM HH:mm"));
				});
				break;
		}
	}
}
