var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Basic;

function Basic(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Basic.prototype.list = function (fn) {
   var basic = this;
   
   if( basic.section == 0 ){
      basic.section = null;
   }

   if( conf.get('administrator' ) == basic.email)basic.users = 0;
   
   if( basic.section ) {
   
      if (basic.users == 1) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section = $2 AND template = $3 AND author = $4',
               [ basic.section, basic.section, basic.template, basic.email ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      
      } else if ( basic.users == 0 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section = $2 AND template = $3',
               [ basic.section, basic.section, basic.template ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      }
   
   } else {
      
      if ( basic.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section is null AND template = $2 AND author = $3',
               [ basic.section, basic.template, basic.email ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      
      } else if ( basic.users == 0 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section is null AND template = $2',
               [ basic.section, basic.template ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      }
   }
};

Basic.prototype.listLimit = function (limit, offset, fn) {
   var basic = this;
   
   if( basic.section == 0 ){
      basic.section = null;
   }
   
   if( conf.get('administrator') == basic.email ) basic.users = 0;
   
   if( basic.section ) {
      
      if ( basic.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section = $2 AND template = $3 AND author = $4 LIMIT $5 OFFSET $6',
               [ basic.section, basic.section, basic.template, basic.email, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
         
      } else if ( basic.users == 0 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section = $2 AND template = $3 LIMIT $4 OFFSET $5',
               [ basic.section, basic.section, basic.template, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      }
      
   } else {
      
      if ( basic.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section is null AND template = $2 AND author = $3 LIMIT $4 OFFSET $5',
               [ basic.section, basic.template, basic.email, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
         
      } else if (basic.users == 0) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел,' +
               'title as Заголовок, content as Контент, alias as Псевдоним ' +
               'FROM node, basic WHERE id = node_id AND section is null AND template = $2 LIMIT $3 OFFSET $4',
               [ basic.section, basic.template, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      }
   }
};

Basic.prototype.editId = function (fn) {
   var basic = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node, basic WHERE id = node_id AND id = $1',
         [ basic.id ], function (err, result) {
         done();
         if (err) return fn(err, null);
         
         return fn(null, result);
      });
   });
};

Basic.prototype.editIdEmail = function (fn) {

   var basic = this;

   pg.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node, basic WHERE id = node_id AND id = $1 AND author = $2',
         [ basic.id, basic.author_edit ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Basic.prototype.save = function (fn) {
   var basic = this;

   for (var key in basic) {
      if ( basic[key] == '' ) {
         basic[key] = null;
      }
   }

   if( basic.status == null ) basic.status = 0;
   if( basic.main == null ) basic.main = 0;

   if( basic.section == 0 ){
      basic.section = null;
   }

   basic.priority = basic.priority * 1;

   if( !basic.priority ){
      basic.priority = null;
   }

   var rollback = function(err, client) {
      client.query('ROLLBACK', function() {
         client.end();
   
         return fn(err, null);
      });
   };

   pool.connect( function (err, client) {


      client.query('BEGIN', function(err, result) {
         if(err) return rollback(err, client);

         client.query('INSERT INTO node (title, alias, date_create, author, status, main, template, section) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)' + 'RETURNING id',
            [ basic.title, basic.alias, basic.date_create, basic.author, basic.status, basic.main, basic.template, basic.section ], function (err, result) {
               if(err) return rollback(err, client);

               if( basic.priority == null ){
                  basic.priority = result.rows[0].id;
               }

               client.query('INSERT INTO basic (content, node_id) VALUES ($1, $2)',
                     [ basic.content, result.rows[0].id ], function (err, result) {
                        if(err) return rollback(err, client);

                        client.query('COMMIT', client.end.bind(client));

                        return fn(null, result);

                     });

            });
      });
   });
};

Basic.prototype.edit = function (fn) {
   var basic = this;


   for (var key in basic) {
      if (basic[key] == '') {
         basic[key] = null;
      }
   }
   
   if( basic.status == null ) basic.status = 0;
   if( basic.main == null ) basic.main = 0;

   if( basic.priority == null ){
      basic.priority = basic.id;
   }

   if( basic.section == 0 ){
      basic.section = null;
   }

   basic.priority = basic.priority * 1;

   if( !basic.priority ){
      basic.priority = null;
   }

   var rollback = function(err, client) {
      client.query('ROLLBACK', function() {
         client.end();

         return fn(err, null);
      });
   };

   pool.connect( function (err, client) {

      client.query('BEGIN', function(err, result) {

         if(err) return rollback(err, client);

         client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, status = $5, main = $6, template = $7, section = $8 WHERE id = $9',
            [ basic.title, basic.alias, basic.date_edit, basic.author_edit, basic.status, basic.main, basic.template, basic.section, basic.id ], function (err, result) {
               if(err) return rollback(err, client);

                  client.query('UPDATE basic SET content = $1, node_id = $2 WHERE node_id = $3',
                     [ basic.content, basic.id, basic.id ], function (err, result) {
                        if(err) return rollback(err, client);

                        client.query('COMMIT', client.end.bind(client));

                        return fn(null, result);

                     });
            });
      });
   });
};

Basic.prototype.drop = function (fn) {
   
   var basic = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('DELETE FROM node WHERE id = $1',
         [ basic.id ], function (err, result) {
         done();
         if (err) return fn(err, null);
      
         return fn(null, result);
         
      });
   });
};

Basic.prototype.isset = function (fn) {
   
   var basic = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id FROM node WHERE alias = $1',
         [ basic.alias ], function (err, result) {
            done();
            if(err) return fn(err, null);
            
            
            if( result.rowCount == 1 && result.rows[0].id == basic.id ){
               return fn(null, 1);
            } else if ( result.rowCount == 1 && result.rows[0].id != basic.id ){
               return fn(null, 0);
            } else {
               return fn(null, 1);
            }
         });
   });
};

Basic.prototype.selectSection = function (fn) {
   
   var basic = this;
   
   if( basic.users == 1 ){
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT section_id, title as section, author FROM sectionandtemplate ' +
            'LEFT JOIN node ON (section_id = id) WHERE template_name = $1 AND author = $2 ORDER BY title',
            [ basic.temp, basic.author ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
      
   } else {

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT section_id, (SELECT title FROM node WHERE id = section_id) as section ' +
            'FROM sectionandtemplate WHERE template_name = $1',
            [ basic.temp ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
   }
   
   
};


Basic.prototype.selectRecord = function (fn) {
   
   var basic = this;
   
   if( basic.users == 1 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id, title, id, author, template, section ' +
            'FROM node, basic WHERE id = node_id AND template = $1 AND section = $2 AND author = $3',
            [ basic.template, basic.section, basic.author ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
      
   } else {

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id, title, id, author, template, section ' +
            'FROM node, basic WHERE id = node_id AND template = $1 AND section = $2',
            [  basic.template, basic.section ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
   }
};

Basic.prototype.getOnePage = function (fn) {
   
   var basic = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name ' +
         'FROM sectionandtemplate, permit WHERE temp = template_name AND template_name = $1 AND section_id = $2',
         [ basic.template, basic.section ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};


Basic.prototype.updateOnePage = function (fn) {

   var basic = this;

   if( basic.id_one_page == 0 ){
      basic.id_one_page = null;
   }

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('UPDATE sectionandtemplate SET id_one_page = $1 WHERE template_name = $2 AND section_id = $3',
         [ basic.id_one_page, basic.template_name, basic.section_id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Basic.prototype.getNameSectionPermit = function (fn) {

   var basic = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM permit WHERE temp = $1',
         [ basic.template ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};




