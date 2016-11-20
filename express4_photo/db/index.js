var pg = require('pg');

var config = {
	user: 'ildar',
	database: 'photo',
	password: 'ildar',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);

module.exports = Photos;

function Photos(obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}
}

Photos.prototype.insert = function (fn) {
	var photos = this;

	pool.connect( function (err, client, done) {
		if (err) return fn(err);

		client.query('insert into node(name, path)VALUES($1,$2)',
			[ photos.name, photos.path], function (err, result) {
				done();
				if (err) return fn(err, null);

				return fn(null, result);

			});
	});
};

Photos.prototype.select = function (fn) {
	var photos = this;

	pool.connect( function (err, client, done) {
		if (err) return fn(err);

		client.query('select * from node', function (err, result) {
				done();
				if (err) return fn(err, null);

				return fn(null, result);

			});
	});
};

Photos.prototype.last = function (fn) {
	pool.connect( function (err, client, done) {
		if (err) return fn(err);

		client.query('select id from node order by id desc limit 1', function (err, result) {
			done();
			if (err) return fn(err, null);

			return fn(null, result);

		});
	});
};