
let Test = {
	init(APP) {
		// return;

		// setTimeout(() => APP.els.content.find(`.btn[data-click="show-options"] i`).trigger("click"), 500);
		// return;

		// if (ME.username === "linus") {
		// 	setTimeout(() => {
		// 		APP.els.content.find(`.teams .team:nth(1)`).trigger("click");
		// 		// APP.els.content.find(`.friend[data-username="linus"]`).trigger("click");
		// 	}, 300);
		// }
		
		if (ME.username === "hbi") {
			setTimeout(() => APP.els.content.find(`.friend[data-username="linus"]`).trigger("click"), 300);
			// setTimeout(() => APP.els.content.find(`.friend[data-username="bill"]`).trigger("click"), 300);

			// setTimeout(() => window.find(`.toolbar-tool_[data-click="toggle-info"]`).trigger("click"), 300);
			// return;

			setTimeout(() => {
				// APP.input.els.input.html("/giphy high five");
				// APP.input.els.input.html("/file");
				APP.input.els.input.html("/file --test --name='karaqu.txt' --size='1.1MB'")
				APP.input.dispatch({ type: "send-message" });

				return;

				setTimeout(() => {
					let str = new Array(1024 * 1024).fill("t").join(""),
						file = new File([str], "foo.txt", { type: "text-plain" }),
						el = APP.els.content.find(`input[name="transmit-file"]`),
						id = el.parents(".file-transmit").data("id");
					APP.transcript.dispatch({ type: "transmit-file-attempt", file, el, id });
				}, 700);
			}, 500);
		}

	}
};
