var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Section;

function Section(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}


Section.prototype.isset = function (fn) {
   
   var section = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id FROM node WHERE alias = $1',
         [ section.alias ], function (err, result) {
            done();
            if(err) return fn(err, null);
            
            
            if(result.rowCount == 1 && result.rows[0].id == section.id){
               return fn(null, 1);
            } else if (result.rowCount == 1 && result.rows[0].id != section.id){
               return fn(null, 0);
            } else {
               return fn(null, 1);
            }
         });
   });
   
};

Section.prototype.save = function (fn) {
   
   var section = this;

   section.line = section.line * 1;

   if( !section.line ){
      section.line = null;
   }
   
   pool.connect( function (err, client, done) {
         
         client.query('INSERT INTO node (title, alias, date_create, author, status, main, template, line) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [ section.title, section.alias, section.date_create, section.author, section.status, section.main, section.template, section.line ], function (err, result) {
               done();
               if(err)return fn(err, null);
      
               return fn(null, result);
               
         });
   });
   
};

Section.prototype.editEmail = function (fn) {

   var section = this;

   section.line = section.line * 1;

   if( !section.line ){
      section.line = null;
   }
   
   pool.connect( function (err, client, done) {
      
      client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, ' +
         'status = $5, main = $6, template = $7, line = $8 WHERE id = $9 AND author = $10',
         [ section.title, section.alias, section.date_create, section.author, section.status, section.main, section.template, section.line, section.id, section.author ], function (err, result) {
            done();

            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });

};

Section.prototype.editId = function (fn) {
   
   var section = this;

   section.line = section.line * 1;

   if( !section.line ){
      section.line = null;
   }
   
   pool.connect( function (err, client, done) {
      
      client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, ' +
         'status = $5, main = $6, template = $7, line = $8 WHERE id = $9',
         [ section.title, section.alias, section.date_create, section.author, section.status, section.main, section.template, section.line, section.id ], function (err, result) {
            done();

            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Section.prototype.dropEmail = function (fn) {
   var section = this;


   pool.connect( function (err, client, done) {


      client.query('UPDATE blockandsection SET section_id = null WHERE section_id = $1',
         [ section.id ], function (err, result) {
            done();
            if(err)return fn(err, null);

         client.query('UPDATE node SET section = null WHERE section = $1 AND author = $2',
            [ section.id, section.author ], function (err, result) {
               done();
               if(err)return fn(err, null);

            client.query('DELETE FROM sectionandtemplate WHERE section_id = $1',
               [ section.id ] , function (err, result) {
               done();
               if(err)return fn(err, null);

               client.query('DELETE FROM node WHERE id = $1 AND author = $2',
                  [ section.id, section.author ], function (err, result) {
                     done();
                     if(err)return fn(err, null);

                     return fn(null, result);

               });
            });
         });
      });
   });
};

Section.prototype.dropId = function (fn) {
   var section = this;

   pool.connect( function (err, client, done) {


      client.query('UPDATE blockandsection SET section_id = null WHERE section_id = $1',
         [ section.id ], function (err, result) {
            done();
            if(err)return fn(err, null);

         client.query('UPDATE node SET section = null WHERE section = $1',
            [ section.id ], function (err, result) {
               done();
               if(err)return fn(err, null);


               client.query('DELETE FROM sectionandtemplate WHERE section_id = $1',
                  [ section.id ], function (err, result) {
                     done();
                     if(err)return fn(err, null);

                     client.query('DELETE FROM node WHERE id = $1',
                     [ section.id ], function (err, result) {
                        done();
                        if(err)return fn(err, null);

                        return fn(null, result);

                     });
                  });

            });
         });
   });
};

Section.prototype.list = function (fn) {
   var section = this;
   
   if( conf.get('administrator') == section.email ) section.users = 0;
   
   if( section.users == 1 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id_sectionandtemplate as "ID", id as Редактирование, title as "Название раздела", alias as "Псевдоним раздела", ' +
            'template_name as "Шаблон", one_page as Запись, date_create as "Дата создания", date_edit as "Дата правки", ' +
            'author as Автор, author_edit as "Автор правки", status as Статус, main as Главная, line as Приоритет ' +
            'FROM node LEFT OUTER JOIN sectionandtemplate ON (id = section_id) WHERE template = $1 AND author = $2 ORDER BY id',
            [ section.template, section.email ], function (err, result) {
               done();
               if (err) {
                  return fn(err, null)
               } else {
                  return fn(null, result);
               }
            });
      });
      
   } else if( section.users == 0 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id_sectionandtemplate as "ID", id as Редактирование, (SELECT title FROM node WHERE id = block_id) as "Блок", ' +
            'title as "Название раздела", alias as "Псевдоним раздела", template_name as "Шаблон", one_page as Запись, ' +
            'date_create as "Дата создания", date_edit as "Дата правки", ' +
            'author as Автор, author_edit as "Автор правки", status as Статус, main as Главная, line as Приоритет ' +
            'FROM node LEFT OUTER JOIN blockandsection ON (node.id = blockandsection.section_id) ' +
            'LEFT OUTER JOIN sectionandtemplate ON (node.id = sectionandtemplate.section_id) WHERE template = $1 ORDER BY id',
            [ section.template ], function (err, result) {
               done();
               if (err) {
                  return fn(err, null)
               } else {
                  return fn(null, result);
               }
            });
      });
   }
};

Section.prototype.getIdEmail = function (fn) {
   
   var section = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE id = $1 AND author = $2',
         [ section.id, section.author ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Section.prototype.getId = function (fn) {
   
   var section = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE id = $1',
         [ section.id ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Section.prototype.getTemplateId = function (fn) {
   
   var section = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
            
      client.query('SELECT temp FROM permit WHERE temp_sort = 1 except ' +
         'SELECT template_name FROM sectionandtemplate WHERE section_id = $1',
         [ section.id ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
         
   });
};


Section.prototype.getTableId= function (fn) {

   var block = this;

   pool.connect( function (err, client, done) {

      client.query('SELECT title as "Название раздела", alias as "Псевдоним раздела", ' +
         'template_name as "Шаблоны раздела", author as "Автор", date_create as "Дата создания", author_edit as "Автор правки", ' +
         'date_edit as "Дата правки", status as "Статус", main as "Главная" ' +
         'FROM node JOIN sectionandtemplate ON(section_id = id) WHERE section_id = $1',
         [ block.id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            return fn(null, result);

         });
   });
};

Section.prototype.addSectionAndTemplate = function (fn) {

   var section = this;

   pool.connect( function (err, client, done) {

      client.query('INSERT INTO sectionandtemplate ( section_id, template_name ) VALUES ($1, $2)',
         [ section.section_id, section.template ], function (err, result) {
            done();

            if(err)return fn(err, null);

            return fn(null, result);

         });
   });
};

Section.prototype.dropTemplate = function (fn) {
   var section = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('DELETE FROM sectionandtemplate WHERE section_id = $1 AND template_name = $2',
         [ section.section_id, section.template_name ], function (err, result) {
            done();
            
            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Section.prototype.createOnePage = function (fn) {

   var section = this;

   if( section.one_page == 0 ){
      section.one_page = null
   }

   pool.connect( function (err, client, done) {
   
      client.query('UPDATE sectionandtemplate SET one_page = $1 WHERE id_sectionandtemplate = $2',
         [ section.one_page, section.id_sectionandtemplate ], function (err, result) {
            done();
         
            if (err)return fn(err, null);
         
            return fn(null, result);
         
         });
   });
};