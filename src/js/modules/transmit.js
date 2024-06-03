
const Transmit = {
	action(phrase, callback) {
		let data = {
				id: "f"+ Date.now(),
				name: "pretty-picture.png",
				size: 123456,
			};
		callback(`/file ${JSON.stringify(data)}`);
	},
	translate(stdIn) {
		let json = JSON.parse(stdIn),
			stdOut = $.nodeFromString(`<file id="${json.id}" name="${json.name}" size="${json.size}" status="inquiry"/>`);
		return stdOut;
	},
	dispatch(event) {
		let APP = chat,
			Self = Transmit,
			next,
			el;
		// console.log(event);
		switch (event.type) {
			case "done-file":
			case "accept-file":
			case "reject-file":
			case "cancel-send":
			case "abort-file":
				el = event.el.parents("div[data-module]");
				next = event.type.split("-")[0];
				APP.transcript.dispatch({ type: "module-message-next", next, el });
				break;
		}
	}
};
