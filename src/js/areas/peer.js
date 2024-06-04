
// chat.peer

{
	connect() {
		let Self = chat.peer,
			connection = Self.receiveConnection.bind(Self);
		// establish connection; on events
		Self.connection = window.peer.connect({ connection });
	},
	sendFile(user, file, uid) {
		let Self = chat.peer,
			item = {
				buffer: file,
				name: file.name,
				type: file.type,
				size: file.size,
				lastModified: file.lastModified,
			};
		// send file item
		Self.fileConnection = Self.connection.connect(user.uuid);
		Self.fileConnection.on("open", () => Self.fileConnection.send(file, null, uid));
		Self.fileConnection.on("chunk", Self.receiveChunk.bind(Self));
		Self.fileConnection.on("close", Self.disconnect.bind(Self));
	},
	receiveConnection(connection) {
		let Self = chat.peer;
		// receiver; connection
		Self.fileConnection = connection;
		Self.fileConnection.on("data", Self.receiveFile.bind(Self));
		Self.fileConnection.on("chunk", Self.receiveChunk.bind(Self));
	},
	receiveChunk(data) {
		// pass data to transcript
		chat.transcript.dispatch({ type: "module-peer-progress", data });
	},
	receiveFile(data) {
		let Self = chat.peer,
			info = {
				type: data.type,
				lastModified: data.lastModified,
			},
			file = new File([data.buffer], data.name, info);

		// download received file
		// window.download(file);
		// console.log(file);
		
		// temp
		Transmit.dispatch({ type: "done-file", el: chat.transcript.els.output.find(`.transmit-progress`) });

		// close p2p connection
		Self.disconnect();
	},
	disconnect() {
		let Self = chat.peer;
		// disconnect connection, if any
		if (Self.fileConnection) {
			Self.fileConnection.close();
		}
		// console.log("closed connection");
	}
}
