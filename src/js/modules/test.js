
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

			return;
			
			setTimeout(() => {
				// APP.transcript.dispatch({ type: "tmp-message-board" });
				let output = APP.transcript.els.output;
				// reset output
				output.html("");

				/* white board
				window.render({
					template: "message-board",
					match: `//Transcripts`,
					append: output,
				});
				window.render({
					template: "message-board",
					match: `//Transcripts`,
					append: output,
				});
				 */

				/* file transfer
				 */
				window.render({
					template: "message-transmit",
					match: `//Transcripts`,
					append: output,
				});
				window.render({
					template: "message-transmit",
					match: `//Transcripts`,
					append: output,
				});

				output.find(".message:nth(1)").removeClass("received").addClass("sent");

			}, 500);

			// setTimeout(() => {
			// 	APP.input.els.input.html("test");
			// 	APP.input.dispatch({ type: "send-message" });
			// }, 500);
		}

	}
};
