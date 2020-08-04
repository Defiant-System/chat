
const chat = {
	init() {
		// fast references
		this.content = window.find("content");

		//defiant.shell("win -a");
	},
	dispatch(event) {
		switch (event.type) {
			case "window.open":
				break;
		}
	}
};

window.exports = chat;
