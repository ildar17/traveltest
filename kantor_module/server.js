var log = require('./logger')(module);
var db = require('./db');
db.connect();

var User = require('./user');

function run() {
	var vasya = new User('Вася');
	var petya = new User('Петя');
	vasya.hello(petya);
	log(db.getPhrase("Hello"));
}


if(module.parent){
	console.log(1);
	exports.run = run;
} else {
	console.log(2);
	run();
}