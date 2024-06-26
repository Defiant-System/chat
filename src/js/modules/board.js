
const Misc = {
	bresenhamLine(x0, y0, x1, y1, cb) {
		let dx = Math.abs(x1 - x0),
			dy = Math.abs(y1 - y0),
			sx = (x0 < x1) ? 1 : -1,
			sy = (y0 < y1) ? 1 : -1,
			err = dx - dy;
		while(true) {
			if (cb) cb(x0, y0);
			if (x0 === x1 && y0 === y1) break;
			let e2 = 2 * err;
			if (e2 > -dy) { err -= dy; x0 += sx; }
			if (e2 < dx) { err += dx; y0 += sy; }
		}
	}
};


const Board = {
	contexts: {},
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
	drawing(data) {
		let ctx = this.contexts[data.id];
		// try to find it
		if (!ctx) {
			let cvs = chat.transcript.els.output.find(`.board[data-id="${data.id}"] canvas`);
			if (cvs[0]) {
				ctx = cvs[0].getContext("2d");
				// save reference for faster next time
				Board.contexts[data.id] = ctx;
			}
		}
		// if there still is no context, just ignore
		if (!ctx) return;
		// obey color
		ctx.fillStyle = data.color;
		// Bresenham's line algorithm
		Misc.bresenhamLine(data.x, data.y, data.cx, data.cy, (x, y) => ctx.fillRect(x, y, data.size, data.size));
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
				switch (true) {
					case el.hasClass("knob"): return Self.doKnob(event);
					case (el.nodeName() === "canvas"): break;
					default: return
				}

				let doc = $(document),
					pEl = el.parents(".board"),
					cvs = event.target,
					ctx = cvs.getContext("2d"),
					click = {
						x: event.clientX - event.offsetX,
						y: event.clientY - event.offsetY,
					},
					size = parseInt(pEl.cssProp("--size"), 10) * 2,
					color = pEl.cssProp("--color"),
					id = pEl.data("id"),
					// Bresenham's line algorithm
					line = Misc.bresenhamLine;
				// set brush properties
				ctx.fillStyle = color;
				// drag object
				Self.drag = { el, doc, cvs, ctx, click, id, size, color, line };
				// cover app body
				APP.els.content.addClass("cover hide-cursor");
				// bind events
				Self.drag.doc.on("mousemove mouseup", Self.dispatch);
				break;
			case "mousemove":
				let x = event.clientX - Drag.click.x,
					y = event.clientY - Drag.click.y,
					cx = Drag.current ? Drag.current.x : x,
					cy = Drag.current ? Drag.current.y : y,
					data = { x, y, cx, cy, id: Drag.id, size: Drag.size, color: Drag.color };
				// draw on canvas
				Drag.line(x, y, cx, cy, (x, y) => Drag.ctx.fillRect(x, y, Drag.size, Drag.size));
				// send state update to friend
				APP.input.dispatch({
					priority: 4, // implicit for "board" module
					type: "silent-message",
					from: ME.username,
					to: APP.channel.username,
					channelId: APP.channel.id,
					message: JSON.stringify(data),
				});
				// save coords
				Drag.current = { x, y };
				break;
			case "mouseup":
				// cover app body
				APP.els.content.removeClass("cover hide-cursor");
				// bind events
				Self.drag.doc.off("mousemove mouseup", Self.dispatch);
				break;

			// custom events
			case "reset-module":
				// user clicked away
				Self.contexts = {};
				break;
			case "select-color":
				el = $(event.target);
				if (!el.attr("style")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				// selected color - set on module
				el.parents(".board").css({ "--color": el.cssProp("--color") });
				break;
		}
	},
	doKnob(event) {
		let APP = chat,
			Self = Board,
			Drag = Self.drag;
		// console.log(event);
		switch (event.type) {
			// native events
			case "mousedown":
				let doc = $(document),
					knob = $(event.target),
					kVal = +knob.data("value"),
					el = knob.parents("li:first").addClass("hover"),
					pEl = el.parents(".board"),
					click = event.clientY;
				// drag object
				Self.drag = { el, knob, pEl, doc, click, kVal };
				// cover app body
				APP.els.content.addClass("cover hide-cursor");
				// bind events
				Self.drag.doc.on("mousemove mouseup", Self.doKnob);
				break;
			case "mousemove":
				let min = 1,
					max = 100,
					value = Drag.kVal + Drag.click - event.clientY;
				value = Math.max(Math.min(value, max), min);
				// brush size
				let size = Math.lerp(1, 7, value/100) | 0;
				Drag.pEl.css({ "--size": `${size}px` });
				// knob UI
				Drag.knob.data({ value: value | 0 });
				break;
			case "mouseup":
				// reset tool
				Drag.el.removeClass("hover");
				// cover app body
				APP.els.content.removeClass("cover hide-cursor");
				// bind events
				Self.drag.doc.off("mousemove mouseup", Self.doKnob);
				break;
		}
	}
};
