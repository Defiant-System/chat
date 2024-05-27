
let Test = {
	init() {
		return;
		// setTimeout(() => window.find(`.teams-list .team:nth(1)`).trigger("click"), 500);
		// setTimeout(() => window.find(`.toolbar-search_ input[name="field-search"]`).select(), 100);
		// setTimeout(() => karaqu.shell("sys -o"), 300);

		if (ME.username === "hbi") {
			window.find(`.friends-list li:nth(2)`).trigger("click");
		}
	}
};
