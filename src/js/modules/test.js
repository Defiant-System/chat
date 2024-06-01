
let Test = {
	init(APP) {
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

			// setTimeout(() => {
			// 	APP.input.els.input.html("test");
			// 	APP.input.dispatch({ type: "send-message" });
			// }, 500);
		}

	}
};
