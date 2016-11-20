var conf = require('../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);


module.exports = Permit;

function Permit(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Permit.prototype.init = function (fn) {
   
   var init = this;
   var arrUrl = init.url.split('/');
   var temp = arrUrl[arrUrl.length - 1];
   var submit = {};
   
   for (var key in init.submit) {
      submit = init.submit[key];
   }
   
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT temp FROM permit WHERE temp = $1', [temp], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            if(result.rowCount == 1){
   
               if (submit.tune) {
      
                  if (submit.browse == undefined) submit.browse = 0;
                  if (submit.make == undefined) submit.make = 0;
                  if (submit.update == undefined) submit.update = 0;
                  if (submit.delete == undefined) submit.delete = 0;
                  if (submit.publication == undefined) submit.publication = 0;
      
      
                  client.query('UPDATE permit SET browse = $1,  make = $2, update = $3,  delete = $4, publication = $5 WHERE temp = $6',
                     [submit.browse, submit.make, submit.update, submit.delete, submit.publication, temp], function (err, resultUPDATE) {
                        done();
                        if (err) return fn(err, null);
                        fn(null, resultUPDATE);
                     });
      
               } else {
                  fn(null, result);
               } 
            }
         
            if(result.rowCount == 0){
   
               client.query('INSERT INTO permit (temp, url_temp) VALUES ($1, $2)', [temp, init.url], function (err, resultINSERT) {
                  done();
                  if (err) return fn(err, null);
      
                  fn(null, resultINSERT);
      
               });
            }
      });
   });
};

Permit.prototype.form = function (fn) {
   
   var form = this;
   var arrUrl = form.url.split('/');
   var temp = arrUrl[arrUrl.length - 1];
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM permit WHERE temp = $1', [temp], function (err, result) {
         done();
         if (err) return fn(err, null);
         
         if(result.rowCount == 1){
            
            var browse = result.rows[0].browse;
            var make = result.rows[0].make;
            var updat = result.rows[0].update;
            var delet = result.rows[0].delete;
            var publication = result.rows[0].publication;
   
   
            var str = '';
   
            str += '\t' + '<div class="permit">' + '\n';
            str += '\t\t' + '<h3>Права доступа</h3>' + '\n';
            str += '\t\t\t' + '<form class="permitForm" action="" method="post">' + '\n';
            
            str += '\t\t\t' + '<p><input type="checkbox"';
            if(browse != 0)  str += ' checked ';
            str += 'name="' + temp + '[browse]" value="1"> Выводить таблицу</p>' + '\n';
            
            str += '\t\t\t' + '<p><input type="checkbox"';
            if(make  != 0)  str += ' checked ';
            str += 'name="' + temp + '[make]" value="10"> Сохранять, добавлять</p>' + '\n';
            
            str += '\t\t\t' + '<p><input type="checkbox"';
            if(updat  != 0)  str += ' checked ';
            str += ' name="' + temp + '[update]" value="100"> Править, редактировать</p>' + '\n';
            
            str += '\t\t\t' + '<p><input type="checkbox"';
            if(delet  != 0)  str += ' checked ';
            str += 'name="' + temp + '[delete]" value="1000"> Удалять</p>' + '\n';
            
            str += '\t\t\t' + '<p><input type="checkbox" ';
            if(publication  != 0)  str += ' checked ';
            str += 'name="' + temp + '[publication]" value="10000"> Публиковать</p>' + '\n';
            str += '<span class="commentForm" > Внимание! после снятия галочек с пунктов, нужно перенастроить роли.</span>' + '\n';

            str += '\t\t\t' + '<p><input class="permit_btn" type="submit" name="' + temp + '[tune]" value="Настроить" /></p>' + '\n';
            str += '\t\t' + '</form>' + '\n';
            str += '\t' + '</div>' + '\n';

            fn(null, str);
   
         } else {
            fn(null, result);
         }

      });
   });
};

Permit.getPermit = function (fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      client.query('SELECT id_permit as id, name as Имя_шаблона, temp as Псевдоним_шаблона, url_temp as Адрес_страницы, browse as Выводить_таблицу, make as Сохранять_добавлять, ' +
         'update as Править_редактировать, delete as Удалять, publication as Публиковать FROM permit ORDER BY priority DESC', function (err, result) {
         done();
         if (err) return fn(err, null);

         fn(null, result);
      });
   });
};

Permit.getOneRole = function (id_role, fn) {
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      client.query('SELECT * FROM role WHERE id_role = $1', [id_role], function (err, result) {
         done();
         if (err) return fn(err, null);
         
         fn(null, result);
      });
   });
};

Permit.setAccess = function(id_role, id_permit, code, fn){
   
   
   function action1(){
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         client.query('SELECT * FROM access WHERE permit_id = $1 and role_id = $2',
            [id_permit, id_role], function (err, result) {
               done();
               if (err) return fn(err, null);
               noend(result);
            });
      });
   }
   
   
   function action2(result){

      if(result.rowCount > 0){
   
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
           
            client.query('UPDATE access SET code = $1 WHERE permit_id = $2 and role_id = $3',
               [code, id_permit, id_role], function(err, result1){
                  done();
                  if (err) return fn(err, null);
            
                  fn(null, result1);
               });
         });
      
      } else if (result.rowCount == 0){
   
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('INSERT INTO  access (code, permit_id, role_id) VALUES ($1, $2, $3)',
               [code, id_permit, id_role], function (err, result2) {
                  done();
                  if (err) return fn(err, null);
            
                  fn(null, result2);
               });
         });
      }
   }

   var tasks = [action1, action2];
   function noend(result) {
      var currentTask = tasks.shift();
      if (currentTask) currentTask(result);
   }
   noend();
};

Permit.prototype.access = function (fn) {
   
   var access = this;
   
   if(access.email == conf.get('administrator')){
      
      fn(null, '11111');
   
   } else {
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
      
         client.query('SELECT u.email, a.code, p.url_temp  FROM users u, role r, access a, permit p WHERE u.role_id = a.role_id ' +
            'AND p.id_permit = a.permit_id AND r.id_role = a.role_id AND u.email = $1 AND p.url_temp = $2',
            [access.email, access.url], function(err, result){
               done();
               if (err) return fn(err, null);
               
               if(result.rowCount == 1){
                  
                  fn(null, result.rows[0].code);
               
               } else {
   
                  pool.connect( function (err, client, done) {
                     if (err) return fn(err);
      
                     client.query("SELECT a.code, p.url_temp, users FROM role r, access a, permit p " +
                        "WHERE p.id_permit = a.permit_id AND r.id_role = a.role_id AND r.users = 1 AND p.url_temp = $1",
                        [access.url], function (err, result) {
                           done();
                           if (err) return fn(err, null);
   
                           if(result.rowCount == 1){
         
                              fn(null, result.rows[0].code);
         
                           } else {

                              fn(null, '00000');
                           }
                        });
                  });
               }
            });
      });
   }
};

Permit.prototype.accessModerator = function (fn) {
   var access = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM users WHERE email = $1',
         [access.email], function (err, result) {
            done();
            if (err) return fn(err, null);

            fn(null, result);
         });
   });
};

Permit.getSection = function( pathname, fn ){
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM permit WHERE url_temp = $1',
         [ pathname ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            fn(null, result);
         });
   });
};