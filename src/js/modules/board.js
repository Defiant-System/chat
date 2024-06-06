
const Board = {
	action(phrase, user, callback) {
		let id = `u${Date.now()}`,
			data = { id };
		callback(`/board  ${JSON.stringify(data)}`);
	},
	translate(stdIn) {
		let json = JSON.parse(stdIn);
		let stdOut = $.nodeFromString(`<board id="${json.id}"/>`);
		return stdOut;
	},
	dispatch(event) {
		let Self = Transmit,
			el;
		// console.log(event);
		switch (event.type) {
			case "select-color":
				console.log(event);
				break;
		}
	}
};
