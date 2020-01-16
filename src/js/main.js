
import { BLOCKS } from "./constants"

let last = Date.now();

const tetris = {
	init() {
		// fast references
		this.content = window.find("content");
	},
	dispatch(event) {
		switch (event.type) {
			case "window.open":
				break;
		}
	},
	loop: {
		frame() {
			let now = Date.now();
			let delta = Math.min(1, (now - last) / 1000.0);
			
			this.update(delta);
			last = now;

			requestAnimationFrame(this.frame);
		},
		update(idt) {
			if (playing) {
				
			}
		}
	},
	render: {

	}
};

window.exports = tetris;
