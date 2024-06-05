
const Transmit = {
	action(phrase, callback) {
		let id = `u${Date.now()}`,
			args = phrase.split("--").filter(e => e).map(e => e.trim()),
			data = { id },
			only;
		
		// simple test setup
		if (args[0] === "test") {
			args.slice(1).map(a => {
				let [key, value] = a.split("=");
				// remove quotes
				value = value.slice(1, -1);
				// translate MB to bytes
				if (key === "size" && value.endsWith("MB")) {
					value = +value.match(/^[\d\.]+/)[0] * 1024 * 1024 | 1; // translate from MB to bytes
				}
				data[key] = value;
			});
		}

		if (!data.name) {
			only = { to: ME.username };
		}
		// console.log(data);

		callback(`/file ${JSON.stringify(data)}`, only);
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
			case "transmit-file-selected":
				// forward event
				APP.transcript.dispatch({
					type: "transmit-file-attempt",
					file: event.el[0].files[0],
					el: event.el,
				});
				break;
			case "select-file":
				event.el.parents(".file-transmit").find(`input[type="file"]`).trigger("click");
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
