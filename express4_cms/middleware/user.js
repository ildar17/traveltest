var mycrypto = require('../lib/decrypto');
var pg = require('pg');
var conf = require('../config/index');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = function (req, res, next) {
   var uid = null;
   
   if( req.signedCookies.user ){
      
      uid = mycrypto.decrypt(req.signedCookies.user);
      req.session.uid = uid.trim();
   
   } else {
      
      uid = req.session.uid;
   }
   
   if (!uid) return next();
   
   pool.connect( function (err, client, done) {
      if (err) return next(err);
      client.query('SELECT id_user, date_registration, email, pass FROM users WHERE email=$1',
         [uid], function (err, result) {
            done();
            
            if (err) return next(err);
            
            if(result.rowCount == 1){
               
               req.user = res.locals.user = result.rows[0].email;
               
               if(uid.trim()==conf.get('administrator'))req.admin = res.locals.admin = conf.get('administrator');
            }
            
            next();
         });
   });
};