
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
				if (APP.channel.id.startsWith("friends-")) {
					user = karaqu.user.friend(event.username);
					// render transcript
					window.render({
						template: "info",
						match: `//Team[@id="friends"]/*[@username="${event.username}"]`,
						target: Self.els.root
					});
					// enable toolbar tool
					APP.toolbar.els.root.find(`.toolbar-tool_[data-click="toggle-info"]`)
						.removeClass("tool-disabled_");
				} else {
					// empty element
					Self.els.root.addClass("hidden").html("");
					// disable toolbar tool
					APP.toolbar.els.root.find(`.toolbar-tool_[data-click="toggle-info"]`)
						.removeClass("tool-active_")
						.addClass("tool-disabled_");
				}
				break;
			case "update-user-status":
				el = Self.els.root.find(`.profile[data-username="${event.username}"]`);
				if (el.length) {
					el.toggleClass("online", !event.status);
					Self.els.root.find(`.action-options .action`).toggleClass("disabled", event.status);
				}
				break;
			case "voice-call-user":
			case "camera-call-user":
				el = event.el.parents(".profile");
				if (el.hasClass("online")) {
					karaqu.shell(`win -o ant:bell { 'type': 'camera-call-user', 'username': '${el.data("username")}' }`);
				}
				break;
		}
	}
}
