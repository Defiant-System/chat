
const Transmit = {
	action(phrase, callback) {
		let data = {
				id: "f"+ Date.now(),
				name: "some-file.txt",
				size: 123456,
			};
		callback(`/file ${JSON.stringify(data)}`);
	},
	translate(stdIn) {
		let json = JSON.parse(stdIn),
			stdOut = $.nodeFromString(`<file id="${json.id}" name="${json.name}" size="${json.size}" status="query"/>`);
		return stdOut;
	},
	dispatch(event) {
		let Self = Transmit,
			el;
		// console.log(event);
		switch (event.type) {
			case "reject-file":
			case "accept-file":
			case "abort-file":
			case "cancel-send":
				console.log(event);
				break;
		}
	}
};
