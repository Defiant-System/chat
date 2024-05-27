
// chat.threads

{
	init() {
		// fast references
		this.els = {
			root: window.find(".threads"),
			threadsList: window.find(".threads-list"),
		};

		// console.log( this.idChannel("friend-hbi-linus") );
		// console.log( this.idChannel("friend-linus-hbi") );
		
		// listen to system event
		window.on("sys:friend-status", this.dispatch);
		window.on("sys:friend-added", this.dispatch);
		window.on("sys:friend-removed", this.dispatch);
	},
	idChannel(id) {
		// team is first
		let parts = id.split("-"),
			team = parts.shift();
		// sort parts alphabeticaly
		parts = parts.sort((a, b) => a === b ? 0 : a < b ? -1 : 1);
		// reaturn true ID
		return [team, ...parts].join("-");
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.threads,
			user,
			el;
		// console.log(event);
		switch (event.type) {
			// subscribed events
			case "friend-status":
				el = Self.els.root.find(`.friend[data-id="friends/${event.detail.username}"]`);
				el.toggleClass("online", event.detail.status !== 1);
				break;
			case "friend-added":
				if (Self.els.threadsList.find(".friends-list").length) {
					// render channels
					let vdom = window.render({
							template: "threads",
							match: `//Teams/Team[@id="friends"]`,
							vdom: true
						}),
						vEl = vdom.find(`li.friend[data-id="friends/${event.detail.username}"]`);
					// insert new friend at "index"
					Self.els.threadsList.find(`li.friend:nth(${vEl.index()-1})`).after(vEl);
				}
				break;
			case "friend-removed":
				// remove from view
				el = Self.els.threadsList.find(`.friends-list .friend[data-id="friends/${event.detail.username}"]`);
				user = el.hasClass("active");
				// remove friend from UI
				el.remove();
				// if friend is active now, click on another friend
				if (user) Self.els.threadsList.find(`.friends-list .friend`).trigger("click");

				// TODO: delete logs from "//Data" ??
				break;
			// custom events
			case "add-friend":
				karaqu.shell("sys -o");
				break;
			case "select-channel":
				Self.els.root.find(".active").removeClass("active");
				// make clicked item active
				event.el.addClass("active");
				break;
			case "render-threads":
				// render channels
				window.render({
					template: "threads",
					match: `//Teams/Team[@id="${event.id}"]`,
					target: Self.els.threadsList
				});
				
				if (event.id === "friends") {
					el = Self.els.root.find(`ul li.online:nth(0)`);
					if (!el.length) el = Self.els.root.find(`ul li:nth(0)`);
					el.trigger("click");
				} else {
					Self.els.root.find(".channel").get(0).trigger("click");
				}
				break;
		}
	}
}
