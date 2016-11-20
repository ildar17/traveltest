var DB = require('../db');
var path = require('path');
var fs = require('fs');
var join = path.join;
var mime = require('mime');


var photos = [];
photos.push({
	name: 'Node.js Logo',
	path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
	name: 'Ryan Speaking',
	path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

exports.list = function(req, res){
	res.render('photos', {
		title: 'Photos',
		photos: photos
	});
};

exports.form = function(req, res){
	res.render('photos/upload', {
		title: 'Photo upload'
	});
};


exports.submit = function (form, dir) {

	return function (req, res, next) {
		form.parse(req, function(err, fields, files) {

			console.log(files);
			if (err) return next(err);

			let last = new DB();
			last.last(function (err, result) {
				if (err) return next(err);
				var id;
				if(result.rowCount == 0){
					id = 0;
				} else {
					id = result.rows[0].id;
				}

				var img = files.image;
				var name = fields.name || img.name;
				var newPath;
				var dbPath;

				let ext = mime.extension(img.type);
				if(ext === 'bin'){
					res.redirect('/');
				} else {
					newPath = dir + '/' + id + '.' + ext;
					dbPath = id + '.' + ext;
				}

				fs.rename( img.path, newPath, function (err) {
					if (err) return next(err);
					let db = new DB({name: name, path: dbPath});
					db.insert(function (err, result) {
						if (err) return next(err);
						if(result.rowCount > 0){
							res.redirect('/');
						}
					})
				}, function (err) {
					if (err) return next(err);
					res.redirect('/');
				});
			});
		});
	}
};