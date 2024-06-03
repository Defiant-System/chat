
// chat.peer

{
	connect() {
		let Self = chat.peer;
		// establish connection; on events
		Self.connection = window.peer.connect({
			connection: Self.receiveConnection.bind(Self),
		});
	},
	send(user, file) {
		let Self = chat.peer;
		Self.fileConnection = Self.connection.connect(user.uuid);

		// Self.fileConnection.send(file);
		// Self.fileConnection.send({ strings: "test" });
		Self.fileConnection.send("test 123");

		// Self.fileConnection.on("close", Self.disconnect.bind(Self));
	},
	receiveConnection(connection) {
		let Self = chat.peer;

		Self.fileConnection = connection;
		// console.log( 123, connection );
		Self.fileConnection.on("open", Self.receiveFile.bind(Self));
		Self.fileConnection.on("data", Self.receiveFile.bind(Self));
		Self.fileConnection.on("close", Self.receiveFile.bind(Self));
		Self.fileConnection.on("error", Self.receiveFile.bind(Self));
	},
	receiveFile() {
		console.log("receiveFile", arguments);
	},
	disconnect() {
		let Self = chat.peer;
		// disconnect connection, if any
		if (Self.connection) {
			Self.connection.disconnect();
		}
	}
}
