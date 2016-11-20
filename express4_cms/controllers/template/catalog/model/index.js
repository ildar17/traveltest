var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Catalog;

function Catalog(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Catalog.prototype.list = function (fn) {
   var catalog = this;

   if( catalog.section == 0 ){
      catalog.section = null;
   }

   if( conf.get('administrator') == catalog.email ) catalog.users = 0;


   if( catalog.section ) {

      if ( catalog.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);

            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section = $2 AND template = $3 AND author = $4 ORDER BY priority DESC',
               [ catalog.section, catalog.section, catalog.template, catalog.email ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });

      } else if ( catalog.users == 0 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);

            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним,  price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section = $2 AND template = $3 ORDER BY priority DESC',
               [ catalog.section, catalog.section, catalog.template ], function (err, result) {
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

      if ( catalog.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);

            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section is null AND template = $2 AND author = $3 ORDER BY priority DESC',
               [ catalog.section, catalog.template, catalog.email ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });

      } else if ( catalog.users == 0 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);

            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним,  price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section is null AND template = $2 ORDER BY priority DESC',
               [ catalog.section, catalog.template ], function (err, result) {
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

Catalog.prototype.listLimit = function (limit, offset, fn) {
   var catalog = this;
   
   if( catalog.section == 0 ){
      catalog.section = null;
   }
   
   if( conf.get('administrator') == catalog.email ) catalog.users = 0;
   
   
   if( catalog.section ) {
      
      if ( catalog.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section = $2 AND template = $3 AND author = $4 ORDER BY priority DESC LIMIT $5 OFFSET $6',
               [catalog.section, catalog.section, catalog.template, catalog.email, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
         
      } else if ( catalog.users == 0 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, ' +
               '(SELECT title FROM node WHERE id = $1) as Раздел, title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним,  price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section = $2 AND template = $3 ORDER BY priority DESC LIMIT $4 OFFSET $5',
               [ catalog.section, catalog.section, catalog.template, limit, offset ], function (err, result) {
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
      
      if ( catalog.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section is null AND template = $2 AND author = $3 ' +
               'ORDER BY priority DESC LIMIT $4 OFFSET $5',
               [ catalog.section, catalog.template, catalog.email, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
         
      } else if (catalog.users == 0) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним,  price as Цена, priority as Приоритет ' +
               'FROM node, catalog WHERE id = node_id AND section is null AND template = $2 ORDER BY priority DESC LIMIT $3 OFFSET $4',
               [ catalog.section, catalog.template, limit, offset ], function (err, result) {
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

Catalog.prototype.editId = function (fn) {
   var catalog = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node, catalog WHERE id = node_id AND id = $1',
         [ catalog.id ], function (err, result) {
         done();
         if (err) return fn(err, null);

         return fn(null, result);
      });
   });
};

Catalog.prototype.editIdEmail = function (fn) {

   var catalog = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node, catalog WHERE id = node_id AND id = $1 AND author = $2',
         [ catalog.id, catalog.author_edit ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Catalog.prototype.save = function (fn) {
   var catalog = this;

   for( var key in catalog ) {
      if ( catalog[key] == '' ) {
         catalog[key] = null;
      }
   }

   if( catalog.status == null ) catalog.status = 0;
   if( catalog.main == null ) catalog.main = 0;
   
   if( catalog.section == 0 ){
      catalog.section = null;
   }

   catalog.priority = catalog.priority * 1;

   if( !catalog.priority ){
      catalog.priority = null;
   }

   catalog.price = catalog.price * 1;

   if( !catalog.price ){
      catalog.price = null;
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
            [ catalog.title, catalog.alias, catalog.date_create, catalog.author, catalog.status, catalog.main, catalog.template, catalog.section ], function (err, result) {
               if(err) return rollback(err, client);

               if( catalog.priority == null ){
                  catalog.priority = result.rows[0].id;
               }

               client.query('INSERT INTO catalog (description, content,  price, priority, node_id) VALUES ($1, $2, $3, $4, $5)',
                     [ catalog.description, catalog.content, catalog.price, catalog.priority, result.rows[0].id ], function (err, result) {
                        if(err) return rollback(err, client);

                        client.query('COMMIT', client.end.bind(client));

                        return fn(null, result);

                     });

            });
      });
   });
};

Catalog.prototype.edit = function (fn) {
   var catalog = this;

   for( var key in catalog ) {
      if( catalog[key] == '' ) {
         catalog[key] = null;
      }
   }
   
   if( catalog.status == null ) catalog.status = 0;
   if( catalog.main == null ) catalog.main = 0;

   if( catalog.priority == null ){
      catalog.priority = catalog.id;
   }
   
   if( catalog.section == 0 ){
      catalog.section = null;
   }

   catalog.priority = catalog.priority * 1;

   if( !catalog.priority ){
      catalog.priority = null;
   }

   catalog.price = catalog.price * 1;

   if( !catalog.price ){
      catalog.price = null;
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
            [ catalog.title, catalog.alias, catalog.date_edit, catalog.author_edit, catalog.status, catalog.main, catalog.template, catalog.section, catalog.id ], function (err, result) {
               if(err) return rollback(err, client);

                  client.query('UPDATE catalog SET description = $1, content = $2, price = $3, priority = $4, node_id = $5 WHERE node_id = $6',
                     [ catalog.description, catalog.content, catalog.price, catalog.priority, catalog.id, catalog.id ], function (err, result) {
                        if(err) return rollback(err, client);

                        client.query('COMMIT', client.end.bind(client));

                        return fn(null, result);

                     });
            });
      });
   });
};

Catalog.prototype.drop = function (fn) {
   
   var catalog = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('DELETE FROM node WHERE id = $1',
         [ catalog.id ], function (err, result) {
         done();
         if (err) return fn(err, null);
      
         return fn(null, result);
         
      });
   });
};

Catalog.prototype.isset = function (fn) {
   
   var catalog = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id FROM node WHERE alias = $1',
         [ catalog.alias ], function (err, result) {
            done();
            if(err) return fn(err, null);
            
            
            if( result.rowCount == 1 && result.rows[0].id == catalog.id ){
               return fn(null, 1);
            } else if ( result.rowCount == 1 && result.rows[0].id != catalog.id ){
               return fn(null, 0);
            } else {
               return fn(null, 1);
            }
         });
   });
};

Catalog.prototype.selectSection = function (fn) {

   var catalog = this;

   if( catalog.users == 1 ){
      pool.connect( function (err, client, done) {
         if (err) return fn(err);

         client.query('SELECT section_id, title as section, author FROM sectionandtemplate ' +
            'LEFT JOIN node ON (section_id = id) WHERE template_name = $1 AND author = $2 ORDER BY title',
            [ catalog.temp, catalog.author ], function (err, result) {
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
            [ catalog.temp ], function (err, result) {
               done();
               if (err) return fn(err, null);

               return fn(null, result);

            });
      });
   }


};

Catalog.prototype.selectRecord = function (fn) {
   
   var catalog = this;
   
   if( catalog.users == 1 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id, title, id, author, template, section ' +
            'FROM node, catalog WHERE id = node_id AND template = $1 AND section = $2 AND author = $3 ORDER BY priority DESC',
            [ catalog.template, catalog.section, catalog.author ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
      
   } else {

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id, title, id, author, template, section ' +
            'FROM node, catalog WHERE id = node_id AND template = $1 AND section = $2 ORDER BY priority DESC',
            [ catalog.template, catalog.section ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
   }
};

Catalog.prototype.getOnePage = function (fn) {

   var catalog = this;

   pool.connect( function (err, client, done) {
         if (err) return fn(err);

         client.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name ' +
            'FROM sectionandtemplate, permit WHERE temp = template_name AND template_name = $1 AND section_id = $2',
            [ catalog.template, catalog.section ], function (err, result) {
               done();
               if (err) return fn(err, null);

               return fn(null, result);

            });
      });
      
};

Catalog.prototype.updateOnePage = function (fn) {
   
   var catalog = this;
   
   if( catalog.id_one_page == 0 ){
      catalog.id_one_page = null;
   }
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('UPDATE sectionandtemplate SET id_one_page = $1 WHERE template_name = $2 AND section_id = $3',
         [ catalog.id_one_page, catalog.template_name, catalog.section_id ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Catalog.prototype.getNameSectionPermit = function (fn) {
   
   var catalog = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM permit WHERE temp = $1',
         [ catalog.template ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

