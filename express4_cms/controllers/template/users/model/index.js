var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Users;

function Users(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Users.prototype.list = function (fn) {
   var users = this;
   
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT id_user as Редактирование, email, login as Логин, ' +
         'date_registration as Дата_регистрации, city as Город, ' +
         'gender as Пол, first_name as Имя, last_name as Фамилия, ' +
         'dob as Дата_рождения, resume as Резюме,  ' +
         "date_hash_url FROM users, userdata WHERE id_user = user_id and email != $1 ORDER BY date_registration DESC",
         [ conf.get('administrator') ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);

         });
   });
};

Users.listLimit = function (limit, offset, fn) {

   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT id_user as Редактирование, email, login as Логин, ' +
         'date_registration as Дата_регистрации, city as Город, ' +
         'gender as Пол, first_name as Имя, last_name as Фамилия, ' +
         'dob as Дата_рождения, resume as Резюме,  ' +
         "date_hash_url FROM users, userdata WHERE id_user = user_id and email != $1 ORDER BY date_registration DESC LIMIT $2 OFFSET $3",
         [ conf.get('administrator'), limit, offset ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Users.prototype.drop = function (fn) {
   var drop = this;
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('DELETE FROM users WHERE id_user = $1',
         [ drop.id_user ], function (err, result) {
            done();
            if (err) return fn(err, null);
   
            client.query('DELETE FROM userdata WHERE user_id = $1',
               [ drop.id_user ], function (err, result) {
                  done();
                  
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
            });
         });
   });
};

Users.prototype.getUserID = function(fn){
   var user = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT email FROM users WHERE id_user = $1',
         [ user.id_user ], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               return fn(null, result);
            }
         });
   });
};

Users.getEmail = function(email, fn){
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT email FROM users WHERE email = $1',
         [ email ], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               return fn(null, result);
            }
         });
   });
};