const objIO = require("socket.io")();
const socketApi = {
	io: objIO,
};

objIO.on("connection", (client) => {
	console.log("Client connected: " + client.id);
});

module.exports = socketApi;
