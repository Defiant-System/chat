
{
	init() {
		// fast references
		this.els = {
			root: window.find(".info"),
		};
	},
	dispatch(event) {
		let Self = chat.info,
			user,
			value,
			el;
		switch (event.type) {
			case "toggle-view":
				value = Self.els.root.hasClass("hidden");
				Self.els.root.toggleClass("hidden", value);
				return value;
			case "render-user":
				user = defiant.user.friend(event.username);
				
				// render transcript
				window.render({
					template: "info",
					match: `sys://Friends/*[@id="${event.username}"]`,
					target: Self.els.root
				});
				break;
		}
	}
}
