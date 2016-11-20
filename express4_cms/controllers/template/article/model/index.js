var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Article;

function Article(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Article.prototype.list = function (fn) {
   var article = this;
   
   if( article.section == 0 ){
      article.section = null;
   }

   if( conf.get('administrator') == article.email ) article.users = 0;
   
   
   if( article.section ) {
   
      if ( article.users == 1 ) {

         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет FROM node, article ' +
               'WHERE id = node_id AND section = $2 AND template = $3 AND author = $4 ORDER BY priority DESC',
               [ article.section, article.section, article.template, article.email ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      
      } else if ( article.users == 0 ) {
      
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет ' +
               'FROM node, article WHERE id = node_id  AND section = $2 AND template = $3 ORDER BY priority DESC',
               [ article.section, article.section, article.template ], function (err, result) {
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
      
      if ( article.users == 1 ) {
      
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет FROM node, article ' +
               'WHERE id = node_id AND section is null AND template = $2 AND author = $3 ORDER BY priority DESC',
               [ article.section, article.template, article.email ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
      
      } else if ( article.users == 0 ) {
      
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
         
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет ' +
               'FROM node, article WHERE id = node_id AND section is null AND template = $2 ORDER BY priority DESC',
               [ article.section, article.template ], function (err, result) {
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

Article.prototype.listLimit = function (limit, offset, fn) {
   var article = this;
   
   if( article.section == 0 ){
      article.section = null;
   }
   
   if( conf.get('administrator') == article.email ) article.users = 0;
   
   
   if( article.section ) {
      
      if ( article.users == 1 ) {
         
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет FROM node, article ' +
               'WHERE id = node_id AND section = $2 AND template = $3 AND author = $4 ORDER BY priority DESC LIMIT $5 OFFSET $6',
               [ article.section,  article.section,  article.template, article.email,  limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
         
      } else if ( article.users == 0 ) {
         
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет ' +
               'FROM node, article WHERE id = node_id  AND section = $2 AND template = $3 ORDER BY priority DESC LIMIT $4 OFFSET $5',
               [ article.section, article.section, article.template, limit, offset ], function (err, result) {
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
      
      if ( article.users == 1 ) {
         
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет FROM node, article ' +
               'WHERE id = node_id AND section is null AND template = $2 AND author = $3 ORDER BY priority DESC LIMIT $4 OFFSET $5',
               [ article.section, article.template, article.email, limit, offset ], function (err, result) {
                  done();
                  if (err) {
                     return fn(err, null)
                  } else {
                     return fn(null, result);
                  }
               });
         });
         
      } else if ( article.users == 0 ) {
         
         pool.connect( function (err, client, done) {
            if (err) return fn(err);
            
            client.query('SELECT id as Редактировать, date_create as "Дата создания", date_edit as "Дата правки", author as Автор, ' +
               'author_edit as "Автор правки", status as Статус, main as Главная, (SELECT title FROM node WHERE id = $1) as Раздел, ' +
               'title as Заголовок, description as Описание,' +
               ' content as Контент, alias as Псевдоним, priority as Приоритет ' +
               'FROM node, article WHERE id = node_id AND section is null AND template = $2 ORDER BY priority DESC LIMIT $3 OFFSET $4',
               [ article.section, article.template, limit, offset ], function (err, result) {
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

Article.prototype.editId = function (fn) {
   var article = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node, article WHERE id = node_id AND id = $1',
         [ article.id ], function (err, result) {
         done();
         if (err) return fn(err, null);

         return fn(null, result);
      });
   });
};

Article.prototype.editIdEmail = function (fn) {

   var article = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node, article WHERE id = node_id AND id = $1 AND author = $2',
         [ article.id, article.author_edit ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Article.prototype.save = function (fn) {
   var article = this;

   for ( var key in article ) {
      if ( article[key] == '' ) {
         article[key] = null;
      }
   }

   if( article.status == null ) article.status = 0;
   if( article.main == null ) article.main = 0;

   if( article.section == 0 ){
      article.section = null;
   }

   article.priority = article.priority * 1;

   if( !article.priority ){
      article.priority = null;
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
            [ article.title, article.alias, article.date_create, article.author, article.status, article.main, article.template, article.section ], function (err, result) {
               if(err) return rollback(err, client);

               if( article.priority == null) {
                  article.priority = result.rows[0].id;
               }

               client.query('INSERT INTO article (description, content, priority, node_id) VALUES ($1, $2, $3, $4)',
                     [ article.description, article.content, article.priority, result.rows[0].id ], function (err, result) {
                        if(err) return rollback(err, client);

                        client.query('COMMIT', client.end.bind(client));

                        return fn(null, result);

                     });

            });
      });
   });
};

Article.prototype.edit = function (fn) {
   var article = this;

   for ( var key in article ) {
      if (article[key] == '') {
         article[key] = null;
      }
   }
   
   if( article.status == null ) article.status = 0;
   if( article.main == null ) article.main = 0;

   if( article.priority == null ){
      article.priority = article.id;
   }

   if( article.section == 0 ){
      article.section = null;
   }

   article.priority = article.priority * 1;

   if( !article.priority ){
      article.priority = null;
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

         client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, status = $5, main = $6, template = $7,  section = $8 WHERE id = $9',
            [ article.title, article.alias, article.date_edit, article.author_edit, article.status, article.main, article.template, article.section, article.id ], function (err, result) {
               if(err) return rollback(err, client);

                  client.query('UPDATE article SET description = $1, content = $2, priority = $3, node_id = $4 WHERE node_id = $5',
                     [ article.description, article.content, article.priority, article.id, article.id ], function (err, result) {
                        if(err) return rollback(err, client);

                        client.query('COMMIT', client.end.bind(client));

                        return fn(null, result);

                     });
            });
      });
   });
};

Article.prototype.drop = function (fn) {
   
   var article = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('DELETE FROM node WHERE id = $1',
         [ article.id ], function (err, result) {
         done();
         if (err) return fn(err, null);
      
         return fn(null, result);
         
      });
   });
};

Article.prototype.isset = function (fn) {
   
   var article = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id FROM node WHERE alias = $1',
         [ article.alias ], function (err, result) {
            done();
            if(err) return fn(err, null);
            
            
            if( result.rowCount == 1 && result.rows[0].id == article.id ){
               return fn(null, 1);
            } else if (result.rowCount == 1 && result.rows[0].id != article.id){
               return fn(null, 0);
            } else {
               return fn(null, 1);
            }
         });
   });
};

Article.prototype.selectSection = function (fn) {

   var article = this;

   if( article.users == 1 ){
      pool.connect( function (err, client, done) {
         if (err) return fn(err);

         client.query('SELECT section_id, title as section, author FROM sectionandtemplate ' +
            'LEFT JOIN node ON (section_id = id) WHERE template_name = $1 AND author = $2 ORDER BY title',
            [ article.temp, article.author ], function (err, result) {
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
            [ article.temp ], function (err, result) {
               done();
               if (err) return fn(err, null);

               return fn(null, result);

            });
      });
   }


};

Article.prototype.selectRecord = function (fn) {
   
   var article = this;
   
   if( article.users == 1 ){
      
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id, title, id, author, template, section ' +
            'FROM node, article WHERE id = node_id AND template = $1 AND section = $2 AND author = $3 ORDER BY priority DESC',
            [ article.template, article.section, article.author ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
      
   } else {
      
      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id, title, id, author, template, section ' +
            'FROM node, article WHERE id = node_id AND template = $1 AND section = $2 ORDER BY priority DESC',
            [ article.template, article.section ], function (err, result) {
               done();
               if (err) return fn(err, null);
               
               return fn(null, result);
               
            });
      });
   }
};

Article.prototype.getOnePage = function (fn) {
   
   var article = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name ' +
         'FROM sectionandtemplate, permit WHERE temp = template_name AND template_name = $1 AND section_id = $2',
         [ article.template, article.section ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Article.prototype.updateOnePage = function (fn) {

   var article = this;

   if( article.id_one_page == 0 ){
      article.id_one_page = null;
   }

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('UPDATE sectionandtemplate SET id_one_page = $1 WHERE template_name = $2 AND section_id = $3',
         [ article.id_one_page, article.template_name, article.section_id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Article.prototype.getNameSectionPermit = function (fn) {

   var article = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM permit WHERE temp = $1',
         [ article.template ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

