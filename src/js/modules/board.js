
const Board = {
	action(phrase, callback) {
		callback("canvas");
	},
	translate(stdIn) {
		return JSON.parse(stdIn);
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
