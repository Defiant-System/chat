
const Giphy = {
	apiKey: "QeIoDbJPQqdpCofwa2tIl3kZ8erGh1VC",
	action(phrase, callback) {
		if (!phrase.trim()) return;
		let url = `//api.giphy.com/v1/gifs/search?q=${phrase}&api_key=${Giphy.apiKey}&limit=1`;
		window.fetch(url).then(res => {
			let stdOut = res.data.length
					? `/giphy ![${phrase}](//i.giphy.com/media/${res.data[0].id}/giphy.gif)`
					: "";
			callback(stdOut);
		});
	},
	translate(stdIn) {
		return stdIn;
	}
};
