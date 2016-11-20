var crypto = require('crypto');
var util = require('util');
var conf = require('../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Auth;

function Auth(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Auth.prototype.save = function (fn) {

   var auth = this;

   auth.hashPassword(function (err) {
      if (err) return fn(err);

      pool.connect( function(err, client, done) {

         client.query('INSERT INTO users (date_registration, login, email, pass) VALUES ($1, $2, $3, $4)' + 'RETURNING id_user',
            [ auth.date_registration, auth.login, auth.email, auth.pass ], function (err, result) {
               done();
               if (err) {
                  return fn(err, null);

               } else {

                  pool.connect( function(err, client, done) {

                     client.query('INSERT INTO userdata (user_id) VALUES ($1)',
                        [result.rows[0].id_user], function (err, result) {
                           done();
                           if (err) {
                              return fn(err, null);
                           } else {
                              return fn(null, result.rowCount);
                           }
                        });

                  });
               }
            });

      });
   });
};

Auth.prototype.hashPassword = function (fn) {
   var auth = this;
   auth.pass = crypto.createHmac('sha1', conf.get('salt')).update(auth.pass).digest('hex');
   fn();
};

Auth.getByName = function (email, fn) {

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id_user, date_registration , email, pass FROM users WHERE email=$1', 
         [email], function (err, result) {
         done();
         if (err) return fn(err);

         fn(null, new Auth(result.rows[0]));
      });

   });
};

Auth.prototype.getRole = function (fn) {

	pool.connect( function (err, client, done) {
		if (err) return fn(err);

		client.query('SELECT id_role FROM role', function (err, result) {
				done();
				if (err) return fn(err);

				fn(null, result);
			});

	});
};

Auth.authenticate = function (email, pass, fn) {
   
   Auth.getByName(email, function (err, user) {

      if (err) return fn(err);

      if (!user.email) return fn();

      var hash = crypto.createHmac('sha1', conf.get('salt')).update(pass).digest('hex');


      if (hash == user.pass.trim()){

         return fn(null, user);

      } else {

         return fn(null, null);
      }

   });
};

Auth.getByNameRebuild = function (email, fn) {

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id_user, date_registration , email, pass, hash_url, date_hash_url FROM users WHERE email=$1', [email], function (err, result) {
         done();
         if (err){
            return fn(err);
         } else {
            fn(null, result.rows[0]);
         }
      });

   });
};

Auth.recordHashUrl = function (email, fn) {

   var hashUrl = crypto.createHmac('sha1', conf.get('salt')).update(email).digest('hex');
   var dateHashUrl = Date.now() + conf.get('dateEmail');

   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      client.query('UPDATE users SET hash_url = $1, date_hash_url = $2 WHERE email = $3',
         [hashUrl, dateHashUrl, email], function (err, result) {
            done();
            if(err) {
               return fn(err, null);
            } else {
               return fn(null, result);
            }
         });

   });
};

Auth.getHashUrl = function (url, fn) {

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id_user, date_registration , email, pass, hash_url, date_hash_url FROM users WHERE hash_url=$1',
         [url], function (err, result) {
            done();
            if (err){
               return fn(err, null);
            } else {
               fn(null, result.rows[0]);
            }
         });

   });
};

Auth.saveNewPass = function (pass, hash_url, fn) {

   var hashPass = crypto.createHmac('sha1', conf.get('salt')).update(pass).digest('hex');

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('UPDATE users SET pass = $1, hash_url = null, date_hash_url = null WHERE hash_url = $2',
         [hashPass, hash_url], function (err, result) {
            done();
            if (err) {
               return fn(err, null);
            } else {
               return fn(null, result);
            }
         });
   });
};