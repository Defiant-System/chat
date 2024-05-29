
let Test = {
	init(APP) {
		// return;
		
		return setTimeout(() => {
			APP.els.content.find(`.teams .team:nth(1)`).trigger("click");

			// setTimeout(() => {
			// 	window.net.send({ from: ME.username, uri: "ant/chat/5076e37534614e85bc1a1edb1d36d796", message: "hello world" });
			// }, 1500);
		}, 100);

		return setTimeout(() => {
			if (ME.username === "hbi") {
				APP.els.content.find(`.teams .team:nth(1)`).trigger("click");

				// APP.els.content.find(`.friends .friend[data-username="linus"]`).trigger("click");
			}
			if (ME.username === "linus") {
				window.bluePrint.selectNodes(`//Transcripts/*`).map(xTranscript => {
					let [team, u1, u2] = xTranscript.getAttribute("id").split("-");
					if (u1 !== "linus") xTranscript.parentNode.removeChild(xTranscript);
				});

				APP.els.content.find(`.friends .friend[data-username="linus"]`).trigger("click");
			}
		}, 100);


		return setTimeout(() => {
			// console.log( APP.els.content.find(`.teams .team:nth(1)`) );
		}, 100);


		// console.log( APP.threads.idChannel("friend-hbi-linus") );
		// console.log( APP.threads.idChannel("friend-linus-hbi") );
	}
};
