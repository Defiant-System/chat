
const Giphy = {
	apiKey: "QeIoDbJPQqdpCofwa2tIl3kZ8erGh1VC",
	async search(phrase, callback) {
		let url = `//api.giphy.com/v1/gifs/search?q=${phrase}&api_key=${this.apiKey}&limit=1`;
		let res = await window.fetch(url);
		callback(res);
	}
};
