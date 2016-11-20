var EventEmitter = require('events').EventEmitter;
var server = new EventEmitter;

server.on('error', (err)=>{
	console.log(err);
});

server.on('action', (first, second)=>{
	console.log(first+' : '+second);
});

server.emit('error', new Error('Это ошибка!'));


server.emit('action', 'раз', 'два');

server.emit('error', new Error('Это вторая ошибка!'));