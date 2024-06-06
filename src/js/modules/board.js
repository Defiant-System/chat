
const Board = {
	action(phrase, user, callback) {
		let id = `u${Date.now()}`,
			data = { id };
		callback(`/board  ${JSON.stringify(data)}`);
	},
	translate(stdIn) {
		let json = JSON.parse(stdIn);
		let stdOut = $.nodeFromString(`<board id="${json.id}"/>`);
		return stdOut;
	},
	dispatch(event) {
		let APP = chat,
			Self = Board,
			Drag = Self.drag,
			el;
		// console.log(event);
		switch (event.type) {
			// native events
			case "mousedown":
				el = $(event.target);
				if (el.nodeName() !== "canvas") return;

				let doc = $(document),
					cvs = event.target,
					ctx = cvs.getContext("2d"),
					click = {
						x: event.clientX - event.offsetX,
						y: event.clientY - event.offsetY,
					};

				// drag object
				Self.drag = { el, doc, cvs, ctx, click };
				// cover app body
				APP.els.content.addClass("cover hide-cursor");
				// bind events
				Self.drag.doc.on("mousemove mouseup", Self.dispatch);
				break;
			case "mousemove":
				let x = event.clientX - Drag.click.x,
					y = event.clientY - Drag.click.y,
					cx = Drag.current ? Drag.current.x : x,
					cy = Drag.current ? Drag.current.y : y;
				
				// draw on canvas
				Drag.ctx.beginPath();
				Drag.ctx.moveTo(cx, cy);
				Drag.ctx.lineTo(x, y);
				Drag.ctx.strokeStyle = Self.cvsColor;
				Drag.ctx.lineWidth = 2;
				Drag.ctx.stroke();
				Drag.ctx.closePath();

				// save coords
				Drag.current = { x, y };
				break;
			case "mouseup":
				// cover app body
				APP.els.content.removeClass("cover hide-cursor");
				// bind events
				Self.drag.doc.off("mousemove mouseup", Self.dispatch);
				break;

			// custome events
			case "select-color":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				// selected color
				Self.cvsColor = el.cssProp("--color");
				break;
		}
	}
};
