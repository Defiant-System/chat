
// chat.popups

{
	init() {
		// fast references
		this.els = {
			root: window.find(".popups"),
		};
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.popups,
			el;
		// console.log(event);
		switch (event.type) {
			// custom event
			case "show-options":
				APP.els.content.addClass("cover");
				// APP.input.els.input.removeAttr("contenteditable"); // force release of focus
				break;
			case "show-smileys":
				APP.els.content.addClass("cover");
				// APP.input.els.input.removeAttr("contenteditable"); // force release of focus
				break;
			case "close-popup":
				break;
		}
	}
}
