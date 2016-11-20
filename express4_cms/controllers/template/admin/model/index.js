var crypto = require('crypto');
var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Admin;

function Admin(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Admin.prototype.getUser = function (fn) {
   
   var user = this;
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM users, userdata  WHERE id_user = user_id and email=$1', [user.email], function (err, result) {
         done();
         if (err) return fn(err);
         
         fn(null, result);
      });
      
   });
};

Admin.getLogin = function (email, login, fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT login FROM users WHERE login = $1 AND email != $2',
         [login, email], function (err, result) {
         done();
      
            if (err) return fn(err, null);
         
         fn(null, result);
      });
      
   });
};

Admin.prototype.save = function (fn) {
   var admin = this;

   if(admin.dob != ''){
      var date = new Date(admin.dob);
      admin.dob = Date.parse(date);
   } else {
      admin.dob = null;
   }

   var hashPass = crypto.createHmac('sha1', conf.get('salt')).update(admin.pass).digest('hex');


   for(var key in admin){
      if(admin[key] == ''){
         admin[key] = null;
      }
   }

   pool.connect( function (err, client, done) {

      if(admin.pass == null){

         if (err) return fn(err);


         client.query('UPDATE users SET login = $1, email = $2 WHERE id_user = $3 ' + 'RETURNING email',
            [admin.login, admin.email, admin.id_user], function (err, result) {
               done();

               if (err) return fn(err, null);

               fn(null, result);

               client.query('UPDATE userdata SET first_name = $1, last_name = $2, dob = $3, gender = $4, city = $5, resume = $6 WHERE user_id = $7',
                  [admin.first_name, admin.last_name, admin.dob, admin.gender, admin.city, admin.resume, admin.id_user], function (err, result) {
                     done();
                     if (err) return fn(err, null);

                     fn(null, result);

               });

         });

      } else {

         client.query('UPDATE users SET login = $1, email = $2, pass = $3 WHERE id_user = $4 ' + 'RETURNING email',
            [admin.login, admin.email, hashPass, admin.id_user], function (err, result) {
               done();
               if (err) return fn(err, null);

               fn(null, result);

               client.query('UPDATE userdata SET first_name = $1, last_name = $2, dob = $3, gender = $4, city = $5, resume = $6 WHERE user_id = $7',
                  [admin.first_name, admin.last_name, admin.dob, admin.gender, admin.city, admin.resume, admin.id_user], function (err, result) {
                     done();
                     if (err) return fn(err, null);

                     fn(null, result);

               });

         });
      }
   });
};

Admin.getAccess = function (email, users, fn) {
   
   if( users == 1 ){
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
      
         client.query('SELECT r.users as Статус, r.name_role as Роль, p.name as Разделы, p.url_temp as Путь_к_разделам,' +
            ' a.code as Права_доступа_к_разделам FROM access a JOIN ' +
            'permit p on(p.id_permit = a.permit_id) JOIN role r on(r.id_role = a.role_id) WHERE ' +
            'r.users = 1 ORDER BY p.priority DESC', function (err, result) {
            done();
   
            if (err) return fn(err, null);
         
            fn(null, result);
         });
      
      });
   }
   
   if( users == 0 ){
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
      
         client.query('SELECT r.users as Статус, r.name_role as Роль, p.name as Разделы, ' +
            'p.url_temp as Путь_к_разделам, a.code as Права_доступа_к_разделам FROM access a JOIN ' +
            'permit p on(p.id_permit = a.permit_id) JOIN role r on(r.id_role = a.role_id) JOIN ' +
            'users u on(r.id_role = u.role_id) WHERE u.email = $1 ORDER BY p.priority DESC', 
            [email], function (err, result) {
            done();
      
               if (err) return fn(err, null);
         
            fn(null, result);
         });
      });
   }
   
   if(users == null){
      fn(null, { rows: [ { name_role: 'Администратор' } ] } );
   }

};

Admin.prototype.drop = function (fn) {
   var admin = this;
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('DELETE FROM users WHERE id_user = $1', [ admin.id_user ],
         function (err, result) {
            done();
            if (err) return fn(err, null);

            client.query('DELETE FROM userdata WHERE user_id = $1', [ admin.id_user ],
               function (err, result) {
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
