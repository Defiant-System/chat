
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
				console.log(event);
				break;
			case "add-channel":
				console.log(event);
				break;
			case "toggle-members":
				console.log(event);
				break;
			case "add-member":
				console.log(event);
				break;
			case "select-thread":
				console.log(event);
				break;
		}
	}
}
