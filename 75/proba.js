var fs = require('fs');

const Events = require('events');

class Watcher extends Events{

	constructor(watchDir, processedDir) {
		super();
		this.watchDir = watchDir;
		this.processedDir = processedDir;
	}

	start(){
		let watcher = this;

		fs.watchFile(watcher.watchDir, ()=>{
			watcher.watch();
		});
	}

	watch(){
		let watcher = this;

		fs.readdir(watcher.watchDir, (err, files)=>{
			if (err) throw err;
			for(var index in files) {
				watcher.emit('process', files[index]);
			}
		});

		watcher.on('process', (file)=>{
			let watchFile = watcher.watchDir + '/' + file;
			let processedFile = watcher.processedDir + '/' + file.toLowerCase();

			fs.rename(watchFile, processedFile, function(err) {
				if (err) throw err;
			});
		})
	}
}

module.exports = Watcher;

