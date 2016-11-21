var express = require('express');
var exphbs = require('express-handlebars');
var fortunes = require('./lib/fortune');

var app = express();

app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});

app.get('/', function(req, res) {
	res.render('home');
});
app.get('/about', function(req, res) {
	res.render('about', { fortune: fortunes.getFortune()} );
});


app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log( 'Express запущен на http://localhost:' +
		app.get('port') + '; нажмите Ctrl+C для завершения.' );
});