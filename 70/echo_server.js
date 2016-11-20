var net = require('net');

var server = net.createServer(function (socket) {
	socket.once('data', function (data) {
		socket.write(data);
	})
});

server.listen(3000);

var EventEmitter = require('events').EventEmitter;
var chanel = new EventEmitter();
chanel.on('join', function () {
	console.log('Привет!');
});
chanel.emit('join');