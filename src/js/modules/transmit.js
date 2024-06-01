
const Transmit = {
	action(phrase, stdOut, callback) {
		
	},
	dispatch(event) {
		let Self = Transmit,
			el;
		// console.log(event);
		switch (event.type) {
			case "reject-file":
			case "accept-file":
			case "abort-file":
				console.log(event);
				break;
		}
	}
};
