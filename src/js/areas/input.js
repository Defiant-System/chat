
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

		// bind event handler (to capture "return")
		this.els.input.on("keydown", this.dispatch);
	},
	dispatch(event) {
		let APP = chat,
			Self = APP.input,
			fnSend,
			data = {},
			el;
		// console.log(event);
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
			case "show-options":
			case "show-smileys":
			case "attach-file":
				break;
			case "emit-typing-info":
				data.from = ME.username;
				data.fromName = ME.name;
				data.to = APP.channel.username;
				data.channelId = APP.channel.id;
				data.typing = event.typing;
				if (!data.to) return;

				// exit if user is not online
				karaqu.shell(`user -i '${data.to}'`)
					.then(check => {
						if (check.result && check.result.online) {
							// send event
							window.net.send({ priority: 1, ...data });
						}
					});
				break;
			case "silent-message":
				data.stamp = Date.now();
				data.priority = 3;
				data.from = event.from;
				data.to = event.to;
				data.channelId = event.channelId;
				data.message = event.message;

				// send to chat lobby
				window.net.send(data);
				break;
			case "send-message":
				data.stamp = Date.now();
				data.action = "initiate";
				data.from = ME.username;
				data.fromName = ME.name;
				data.to = APP.channel.username;
				data.channelId = APP.channel.id;
				data.message = event.message || Self.els.input.text();

				if (APP.room.id === "friends") {
					data.options = [
						{
							id: karaqu.AFFIRMATIVE,
							name: "Show",
							payload: "action,message,channelId",
						},
						{
							id: karaqu.NEGATIVE,
							name: "Close",
							// payload: "message,channelId",
						}
					];
				} else {
					// message is sent to a "team"
					data.room = APP.room.id;
					// hygiene
					delete data.to;
					// return console.log(data);
				}

				// send function
				fnSend = data => {
					// send to chat lobby
					window.net.send(data);
					// clear input on "next tick"
					setTimeout(() => Self.els.input.html(""), 1);
				};

				let mod = data.message.match(/^\/\w+/);
				if (mod) {
					let cmd = mod[0].trim(),
						phrase = data.message.slice(cmd.length).trim();
					Mod[cmd].action(phrase, stdOut => {
						data.message = stdOut;
						// send message package
						fnSend(data);
					});
				} else {
					// send message package
					fnSend(data);
				}
				break;
		}
	}
}
