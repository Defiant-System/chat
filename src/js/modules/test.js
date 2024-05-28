
let Test = {
	init(APP) {
		// return;

		return setTimeout(() => {
			APP.els.content.find(`.friends .friend[data-username="linus"]`).trigger("click");
		}, 100);


		return setTimeout(() => {
			// console.log( APP.els.content.find(`.teams .team:nth(1)`) );
			APP.els.content.find(`.teams .team:nth(1)`).trigger("click");
		}, 100);


		// console.log( APP.threads.idChannel("friend-hbi-linus") );
		// console.log( APP.threads.idChannel("friend-linus-hbi") );
	}
};
