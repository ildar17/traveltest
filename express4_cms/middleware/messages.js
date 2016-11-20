var express = require('express');
var res = express.response;

res.message = function(msg, type){
   type = type || 'info';
   var sess = this.req.session;

   sess.messages = sess.messages || [];
   
   sess.messages.push({ type: type, string: msg });
};

res.error = function(msg){
   return this.message(msg, 'error');
};

res.repeatData = function(msg){
   return this.message(msg, 'repeatData');
};

res.readyOk = function(msg){
   return this.message(msg, 'readyOk');
};

module.exports = function(req, res, next){
   res.locals.messages = req.session.messages || [];
   res.locals.removeMessages = function(){
      req.session.messages = [];
   };
   next();
};