var conf = require('./config');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var app = express();
app.listen(conf.get('port'));

var path = require('path');
var join = path.join;
var bodyParser = require('body-parser');
var session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');

app.use(logger('dev'));
app.use(function (req, res, next) {
   res.set('X-Powered-By', 'MySite');
   next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('optional secret string'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true
}));

var user = require('./middleware/user');
app.use(user);

var messages = require('./middleware/messages');
app.use(messages);

var controllers = require('./controllers/index');
app.use(controllers);



app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: err
      });
   });
}

app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});