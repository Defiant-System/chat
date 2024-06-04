
const Transmit = {
	action(phrase, callback) {
		let id = `u${Date.now()}`,
			args = phrase.split("--").filter(e => e).map(e => e.trim()),
			data = { id };
		
		// simple test setup
		if (args[0] === "test") {
			args.slice(1).map(a => {
				let [key, value] = a.split("=");
				if (key === "size") value = +value.match(/^\d[\d\.]+/)[0] * 1024 * 1024; // translate from MB to bytes
				data[key] = value;
			});
		}

		callback(`/file ${JSON.stringify(data)}`, true);
	},
	translate(stdIn) {
		let json = JSON.parse(stdIn),
			str = json.name
				? `name="${json.name}" size="${json.size}" status="inquiry"`
				: `status="select-file"`,
			stdOut = $.nodeFromString(`<file id="${json.id}" ${str}/>`);
		return stdOut;
	},
	dispatch(event) {
		let APP = chat,
			Self = Transmit,
			next,
			el;
		// console.log(event);
		switch (event.type) {
			case "select-file":
				console.log(event);
				break;
			case "cancel-select":
				event.el.parents(".message").cssSequence("vanish", "animationend", el => el.remove());
				break;
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
