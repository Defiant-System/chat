
// chat.popups

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
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
			str,
			el;
		// console.log(event);
		switch (event.type) {
			// native events
			case "mouseup":
				// if click inside popup element
				if ($(event.target).parents(".popups").length) return;
				Self.dispatch({ type: "close-popup" });
				break;
			
			// popup events
			case "show-options":
				Self.dispatch({ ...event, type: "open-popup", popEl: Self.els.popOptions });
				break;
			case "show-smileys":
				Self.dispatch({ ...event, type: "open-popup", popEl: Self.els.popSmileys });
				break;
			case "open-popup":
				rect = event.popEl[0].getBoundingClientRect();
				offset = event.el.offset("content");
				dim = {
					top: offset.top - rect.height - 19,
					left: offset.left + (offset.width >> 1) - (rect.width >> 1) - 7,
				};
				// pop-up bubble
				event.popEl.css(dim).cssSequence("pop-show", "animationend", el => {
					// anything to do?
				});

				// save reference to popup
				Self.popEl = event.popEl;

				// force release of focus
				// APP.input.els.input.removeAttr("contenteditable");

				// capture next mouseup event
				Self.els.doc.bind("mouseup", Self.dispatch);
				break;
			case "close-popup":
				// hide with animation
				Self.popEl.cssSequence("pop-hide", "animationend", el => el.removeClass("pop-show pop-hide"));
				// reset reference
				delete Self.popEl;
				// unbind event handler
				Self.els.doc.unbind("mouseup", Self.dispatch);
				break;

			// custom events
			case "insert-smiley":
				str = $(event.target).data("str") +"&#160;";
				// APP.input.els.input.append(str);
				document.execCommand("insertHTML", false, str);
				// close popup
				Self.dispatch({ type: "close-popup" });
				break;
			case "module-file":
				str = event.el.data("str");
				document.execCommand("insertHTML", false, str);
				// send message
				APP.input.dispatch({ type: "send-message" });
				// close popup
				Self.dispatch({ type: "close-popup" });
				break;
			case "module-giphy":
			case "module-board":
				str = "/"+ event.type.split("-")[1] +"&#160;";
				// APP.input.els.input.append(str);
				document.execCommand("insertHTML", false, str);
				// close popup
				Self.dispatch({ type: "close-popup" });
				break;
		}
	}
}
