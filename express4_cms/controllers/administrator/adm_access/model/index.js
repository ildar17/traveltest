var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Administrator;

function Administrator(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Administrator.prototype.saveRole = function (fn) {
   var administrator = this;
   
   if (administrator.users == '') {
      administrator.users = null;
   }
   
   if (administrator.users == 1) {
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('UPDATE role SET users = NULL WHERE users = 1', function (err, result) {
            done();
            if (err) return fn(err, null);
            
            
            client.query('INSERT INTO role ( name_role, users ) VALUES ( $1, $2)',
               [administrator.nameRole, administrator.users], function (err, result) {
                  done();
                  if (err) return fn(err, null);
                  
                  fn(null, result);
               });
         });
      });
      
   } else {
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('INSERT INTO role ( name_role, users ) VALUES ( $1, $2)',
            [administrator.nameRole, administrator.users], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               fn(null, result);
            });
      });
   }
};

Administrator.prototype.editRole = function (fn) {
   var administrator = this;
   
   if (administrator.users == '') {
      administrator.users = null;
   }
   
   var id_role = administrator.id_role * 1;

   if (administrator.users == 1) {
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('UPDATE role SET users = NULL WHERE users = 1', function (err, result) {
            done();
            if (err) return fn(err, null);
            
            
            client.query('UPDATE role SET name_role = $1, users = $2 WHERE id_role = $3',
               [administrator.nameRole, administrator.users, id_role ], function (err, result) {
                  done();
                  if (err) return fn(err, null);
                  
                  fn(null, result);
               });
         });
      });
      
   } else {
   
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('UPDATE role SET name_role = $1, users = $2 WHERE id_role = $3',
            [administrator.nameRole, administrator.users, id_role ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               fn(null, result);
            });
      });
   }
};

Administrator.prototype.getRole = function (fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT id_role as Администрирование, name_role as Название_роли, users as Роль_для_пользователей FROM role ORDER BY id_role',
         function (err, result) {
         done();
         if (err) return fn(err, null);
         
         fn(null, result);
      });
      
   });
};

Administrator.prototype.getRoleUrl = function (fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT id_permit as Администрирование, name as Имя_шаблона, priority as Приоритет, temp as Псевдоним_шаблона, url_temp as Адрес_страницы, ' +
         'browse as Просматривать, make as Сохранять, update as Править, delete as Удалять, publication as Публиковать FROM permit ORDER BY priority DESC',
         function (err, result) {
         done();
         if (err) return fn(err, null);

         fn(null, result);
      });
      
   });
   
};

Administrator.prototype.getOneRole = function (fn) {
   var administrator = this;
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM role WHERE id_role = $1',
         [administrator.editRole], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            fn(null, result);
         });
      
   });
};

Administrator.getAllRoleModerator = function (fn) {
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM role WHERE users is null ORDER BY name_role', function (err, result) {
            done();
            if (err) return fn(err, null);
            
            fn(null, result);
         });
      
   });
};

Administrator.getRoleUsers = function (fn) {
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM role WHERE users is not null', function (err, result) {
         done();
         if (err) return fn(err, null);
         
         fn(null, result);
      });
      
   });
};

Administrator.prototype.deleteRole = function (fn) {
   var administrator = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('DELETE FROM access WHERE role_id = $1',
         [administrator.dropRole], function (err, result) {
            done();
            if (err) return fn(err, null);
         });
      
   });
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('UPDATE users SET role_id = null WHERE role_id = $1',
         [administrator.dropRole], function (err, result) {
            done();
            if (err) return fn(err, null);
         });
      
   });
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('DELETE FROM role WHERE id_role = $1',
         [administrator.dropRole], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            fn(null, result);
         });
      
   });
};

Administrator.dropRolePage = function (dropRolePage, fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM permit WHERE id_permit = $1',
         [dropRolePage], function (err, result) {
            done();
            if (err) return fn(err, null);

            if(result.rowCount == 1){

               client.query('DELETE FROM sectionandtemplate WHERE template_name = $1',
                  [ result.rows[0].temp ], function (err, result) {
                     done();



                  });
            }
         });
   });
   
   
   
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('DELETE FROM access WHERE permit_id = $1',
         [dropRolePage], function (err, result) {
            done();
            if (err) return fn(err, null);
         });
   });
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('DELETE FROM permit WHERE id_permit = $1',
         [dropRolePage], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            fn(null, result);
         });
   });
};

Administrator.getUsers = function (fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query("SELECT id_user as Администрирование, name_role as Роль,  date_registration as Дата_регистрации, login as Логин," +
         " email, first_name as Имя, last_name as Фамилия, city as Город, dob as Дата_рождения, gender as Пол, resume as О_себе " +
         "FROM users join userdata on(id_user = user_id ) left outer join role on(role_id = id_role) WHERE email != $1 " +
         "ORDER BY  date_registration DESC",
         [conf.get('administrator')], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               return fn(null, result);
            }
         });
   });
};

Administrator.getOneUser = function (id_user, fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id_user as Присвоить_роль, id_role, name_role,  date_registration, login, email, first_name, last_name, city, ' +
         'dob, gender, resume ' +
         'FROM users join userdata on(id_user = user_id ) left outer join role on(role_id = id_role) WHERE id_user = $1',
         [id_user], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               return fn(null, result);
            }
         });
   });
};

Administrator.prototype.assignRole = function (fn) {

   var administrator = this;

   if(administrator.usersRoleId == administrator.role_id){
      administrator.role_id = null;
   }
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('UPDATE users SET role_id = $1 WHERE id_user = $2',
         [administrator.role_id, administrator.id_user], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               return fn(null, result);
            }
         });
   });

};

Administrator.prototype.addNamePermit = function (fn) {

   var administrator = this;

   if(administrator.priority == ''){
      administrator.priority = null;
   }
   
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('UPDATE permit SET name = $1, priority = $2 WHERE id_permit = $3',
         [administrator.name, administrator.priority, administrator.id_permit], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               fn(null, result);
            }
         });
   });

};

Administrator.prototype.getOnePermit = function (fn) {
   
   var administrator = this;
   
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM permit WHERE id_permit = $1 ORDER BY priority DESC',
         [administrator.id_permit], function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               fn(null, result.rows[0]);
            }
         });
   });
   
};

Administrator.getPermit = function (fn) {
   
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT a.code, p.url_temp, r.name_role, p.id_permit, r.id_role FROM role r, access a, permit p ' +
         'WHERE p.id_permit = a.permit_id AND r.id_role = a.role_id ORDER BY r.id_role', function (err, result) {
            done();
            if (err) {
               return fn(err, null)
            } else {
               fn(null, result);
            }
         });
   });
   
};