
// chat.popups

{
	init() {
		// fast references
		this.els = {
			root: window.find(".popups"),
			popOptions: window.find(".popups .popup-options"),
			popSmileys: window.find(".popups .popup-smileys"),
		};
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.popups,
			offset,
			rect,
			dim,
			el;
		// console.log(event);
		switch (event.type) {
			// custom event
			case "show-options":
				el = Self.els.popOptions;
				rect = el[0].getBoundingClientRect();
				offset = event.el.offset("content");
				dim = {
					top: offset.top - rect.height - 19,
					left: offset.left + (offset.width >> 1) - (rect.width >> 1) - 7,
				};
				console.log(offset);
				console.log(rect);
				console.log(dim);

				el.addClass("show").css(dim);
				// APP.els.content.addClass("cover");
				// APP.input.els.input.removeAttr("contenteditable"); // force release of focus
				break;
			case "show-smileys":
				console.log(event);
				// APP.els.content.addClass("cover");
				// APP.input.els.input.removeAttr("contenteditable"); // force release of focus
				break;
			case "close-popup":
				break;
		}
	}
}
