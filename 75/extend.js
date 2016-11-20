var events = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var watchDir = './watch';
var processedDir  = './done';

function Watcher(watchDir, processedDir) {
	this.watchDir = watchDir;
	this.processedDir = processedDir;
}

Watcher.prototype = new events.EventEmitter();

Watcher.prototype.watch = function() {
	var watcher = this;

	fs.readdir(this.watchDir, function(err, files) {
		if (err) throw err;
		for(var index in files) {
			watcher.emit('process', files[index]);
		}
	})
};

Watcher.prototype.start = function() {
	var watcher = this;

	fs.watchFile(watcher.watchDir, function() {
		watcher.watch();
	});
};

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file) {
	var watchFile      = this.watchDir + '/' + file;
	var processedFile  = this.processedDir + '/' + file.toLowerCase();

	console.log(watchFile);
	console.log(processedFile);

	fs.rename(watchFile, processedFile, function(err) {
		if (err) throw err;
	});
});

console.log(watcher);

watcher.start();

