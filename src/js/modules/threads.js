
{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			threadsList: window.find(".threads-list"),
			channels: window.find(".threads .channels"),
			members: window.find(".threads .members"),
		};
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.threads,
			xpath,
			id,
			el;
		switch (event.type) {
			case "toggle-channels":
			case "toggle-members":
				el = event.el.parent();
				el.toggleClass("collapsed", el.hasClass("collapsed"));
				break;
			case "add-channel":
			case "add-member":
			case "add-friend":
				console.log(event);
				break;
			case "select-thread":
				Self.els.root.find(".active").removeClass("active");
				// make clicked item active
				event.el.addClass("active");

				// remove unread notification flags
				Self.dispatch({ ...event, type: "remove-unread"});

				id = event.el.data("id");
				APP.transcript.dispatch({ type: "render-thread", id });

				// temp
				// APP.transcript.dispatch({
				// 	type: "receive-message",
				// 	room: "contacts::urbanal",
				// 	from: "urbanal",
				// 	stamp: Date.now(),
				// 	message: "hello :)"
				// });
				break;
			case "render-team":
				// render channels
				window.render({
					template: "threads",
					match: `//Teams/Team[@id="${event.id}"]`,
					target: Self.els.threadsList
				});
				
				Self.dispatch({ ...event, type: "check-for-unread" });

				// temp
				let n = defiant.user.username === "hbi" ? 2 : 3;

				// auto-click first thread
				el = Self.els.root.find("ul li").get(n);
				if (!el.prop("className").startsWith("add-")) {
					el.trigger("click");
				}
				break;
			case "remove-unread":
				// remove potential notification
				setTimeout(() => event.el.find(".notification").remove(), 500);

				xpath = `//Transcripts/*[@id="${event.el.data("id")}"]//*[@unread]`;
				window.bluePrint.selectNodes(xpath).map(node => node.removeAttribute("unread"));
				break;
			case "check-for-unread":
				xpath = `//Teams/Team[@id="${event.id}"]/*/*[@id]`;
				window.bluePrint.selectNodes(xpath).map(node => {
					let id = event.id +"::"+ node.getAttribute("id"),
						xpath = `//Transcripts/*[@id="${id}"]//*[@unread]`,
						unread = window.bluePrint.selectNodes(xpath);
					if (unread.length) {
						Self.els.root.find(`li[data-id="${id}"]`)
							.append(`<span class="notification">${unread.length}</span>`);
					}
				});
				break;
		}
	}
}
