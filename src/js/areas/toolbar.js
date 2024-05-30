
// chat.toolbar

{
	init() {
		// fast references
		this.els = {
			root: window.find(`div[data-area="toolbar"]`),
		};
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.toolbar,
			el;
		switch (event.type) {
			case "toggle-info":
				return APP.info.dispatch({ ...event, type: "toggle-view" });
			case "toggle-view":
				break;
		}
	}
}
