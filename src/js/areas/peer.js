
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

		Self.fileConnection.on("open", () => {

			Self.fileConnection.send(file);
			// Self.fileConnection.send({ strings: "test" });
			// Self.fileConnection.send({ tmp: "test 123" });

		});
		// Self.fileConnection.on("data", Self.receiveFile.bind(Self));
		// Self.fileConnection.on("close", Self.disconnect.bind(Self));
	},
	receiveConnection(connection) {
		let Self = chat.peer;

		Self.fileConnection = connection;
		console.log( 1, connection );
		// console.log( 2, connection.serialization );
		Self.fileConnection.on("data", Self.receiveFile.bind(Self));
	},
	receiveFile(data) {
		let Self = chat.peer;
		
		console.log("receiveFile", data);
		
		// Self.fileConnection.send({ b: "hellow 123" });
	},
	disconnect() {
		let Self = chat.peer;
		// disconnect connection, if any
		if (Self.connection) {
			Self.connection.disconnect();
		}
	}
}
