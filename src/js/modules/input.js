
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
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.input,
			stamp,
			team,
			from,
			to,
			channel,
			message,
			typing,
			el;
		switch (event.type) {
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
				category = "typing";
				from = ME;
				to = APP.channel.username;
				team = APP.channel.team;
				channel = APP.channel.id;
				typing = event.typing;

				// send to chat lobby
				window.net.send({ category, team, from, to, channel, typing });
				break;
			case "send-message":
				category = "message";
				stamp = Date.now();
				from = ME;
				to = APP.channel.username;
				team = APP.channel.team;
				channel = APP.channel.id;
				message = Self.els.input.text();

				// send to chat lobby
				window.net.send({ team, from, to, channel, stamp, message });
				// clear input
				Self.els.input.html("");
				break;
		}
	}
}
