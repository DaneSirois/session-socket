
// User API:
const User = (() => {
	this.create = (socket, obj) => {
		return Object.assign(
			{
				rooms: () => socket.adapter.rooms,
				roomList: () => Object.keys(socket.adapter.rooms),
        joinRoom: (room) => socket.join(room),
				leaveRoom: (room) => socket.leave(room)
      },
      obj
    );
	};
	return {
		create: (socket, obj) => this.create(socket, obj)
	};
})();

// Connection API:
const Connections = (() => {
	this.connections = {};

	this.connect = (socket, obj) => {
    const user = User.create(socket, obj);

		// Connect the user:
		return this.connections[socket.id] ? null : this.connections[socket.id] = user;
	};

  this.get = (socket) => {
		const error = "No user with that socket ID is set";
		return this.connections[socket.id] ? this.connections[socket.id] : error;
	};

	return {
		all: () => this.connections,
		get: (socket) => this.get(socket),
		toArray: () => Object.keys(this.connections).map((key) => this.connections[key]),
		length: () => Object.keys(this.connections).length,
		connect: (socket, obj) => this.connect(socket, obj),
		disconnect: (socket) => delete this.connections[socket.id]
	};
})();

// Session-Socket API:
module.exports = (() => {
	this.addPlugin = (key, plugin) => {
		const error = "A plugin with that name already exists";
		return this.API[key] ? error : this.API[key] = plugin;
	};

	this.API = {
    addPlugin: this.addPlugin,
		connections: Connections,
    get: (socket) => Connections.get(socket),
		connect: (socket, obj) => Connections.connect(socket, obj),
		disconnect: (socket) => Connections.disconnect(socket)
  };

	return this.API;
})();
