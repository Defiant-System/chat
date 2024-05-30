
// chat.info

{
	init() {
		// fast references
		this.els = {
			root: window.find(".info"),
		};
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.info,
			user,
			value,
			el;
		switch (event.type) {
			case "toggle-view":
				value = Self.els.root.hasClass("hidden");
				Self.els.root.toggleClass("hidden", value);
				return value;
			case "render-user":
				user = karaqu.user.friend(event.username);
				
				// render transcript
				window.render({
					template: "info",
					match: `sys://Friends/*[@id="${event.username}"]`,
					target: Self.els.root
				});
				break;
			case "voice-call-user":
			case "camera-call-user":
				console.log(event);
				break;
		}
	}
}
