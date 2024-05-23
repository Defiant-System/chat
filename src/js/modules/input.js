
// chat.input

{
	typing: {
		timer: 2500,
		started: false,
	},
	init() {
		// fast references
		this.els = {
			root: window.find(".transcript .input"),
			input: window.find(".transcript .input > div"),
		};

		// bind event handler
		this.els.input.on("keydown", this.dispatch);

		// temp
		// setTimeout(() => {
		// 	this.els.input.text("hello");
		// 	this.dispatch({ type: "window.keystroke", keyCode: 13 });
		// }, 800);
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.input,
			stamp,
			team,
			from,
			fromName,
			to,
			channel,
			message,
			typing,
			el;
		switch (event.type) {
			// native events
			case "keydown":
				if (event.keyCode === 13) {
					// prevent default behaviour
					event.preventDefault();
				}
				break;
			// system events
			case "window.keystroke":
				let stopTimer = () => {
						if (Self.typing.started) {
							// socket emit "typing stop"
							Self.dispatch({ type: "emit-typing-info", typing: false });
						}
						Self.typing.started = false;
						clearTimeout(Self.timeout);
					};
				if (event.keyCode === 13) {
					Self.dispatch({ type: "send-message" });
					return stopTimer();
				}

				if (!Self.typing.started) {
					// socket emit "typing start"
					Self.typing.started = true;
					Self.dispatch({ type: "emit-typing-info", typing: true });
				}

				clearTimeout(Self.timeout);
				Self.timeout = setTimeout(stopTimer, Self.typing.timer);
				break;
			// custom event
			case "emit-typing-info":
				from = ME.username;
				fromName = ME.name;
				to = APP.channel.username;
				team = APP.channel.team;
				channel = APP.channel.id;
				typing = event.typing;

				// send to chat lobby
				window.net.send({ priority: 1, team, from, fromName, to, channel, typing });
				break;
			case "send-message":
				stamp = Date.now();
				from = ME.username;
				fromName = ME.name;
				to = APP.channel.username;
				team = APP.channel.team;
				channel = APP.channel.id;
				message = Self.els.input.text();
				// message = `${fromName}: ${Self.els.input.text()}`;

				// send to chat lobby
				window.net.send({ team, from, fromName, to, channel, message, stamp });
				// clear input
				setTimeout(() => Self.els.input.html(""), 1);
				break;
		}
	}
}
