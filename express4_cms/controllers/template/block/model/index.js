var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Block;

function Block(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}


Block.prototype.isset = function (fn) {
   
   var block = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id FROM node WHERE alias = $1',
         [ block.alias ], function (err, result) {
            done();
            if(err) return fn(err, null);
            
            
            if(result.rowCount == 1 && result.rows[0].id == block.id){
               return fn(null, 1);
            } else if (result.rowCount == 1 && result.rows[0].id != block.id){
               return fn(null, 0);
            } else {
               return fn(null, 1);
            }
         });
   });
   
};

Block.prototype.save = function (fn) {
   
   var block = this;

   block.line = block.line * 1;

   if( !block.line ){
      block.line = null;
   }
   
   pool.connect( function (err, client, done) {
         
         client.query('INSERT INTO node (title, alias, date_create, author, status, main, template, line) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [ block.title, block.alias, block.date_create, block.author, block.status, block.main, block.template, block.line ], function (err, result) {
               done();
               if(err)return fn(err, null);
      
               return fn(null, result);
               
         });
   });
   
};

Block.prototype.editEmail = function (fn) {

   var block = this;

   block.line = block.line * 1;

   if( !block.line ){
      block.line = null;
   }

   pool.connect( function (err, client, done) {
      
      client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, ' +
         'status = $5, main = $6, template = $7, line = $8 WHERE id = $9 AND author = $10',
         [ block.title, block.alias, block.date_create, block.author, block.status, block.main, block.template, block.line, block.id, block.author ], function (err, result) {
            done();

            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });

};

Block.prototype.editId = function (fn) {
   
   var block = this;

   block.line = block.line * 1;

   if( !block.line ){
      block.line = null;
   }
   
   
   pool.connect( function (err, client, done) {
      
      client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, ' +
         'status = $5, main = $6, template = $7, line = $8 WHERE id = $9',
         [ block.title, block.alias, block.date_create, block.author, block.status, block.main, block.template, block.line, block.id ], function (err, result) {
            done();

            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Block.prototype.dropEmail = function (fn) {
   var block = this;


   pool.connect( function (err, client, done) {


      client.query('UPDATE layerandblock SET block_id = null WHERE block_id = $1',
         [ block.id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            client.query('DELETE FROM blockandsection WHERE block_id = $1',
               [block.id], function (err, result) {
                  done();
                  if(err)return fn(err, null);

                  client.query('DELETE FROM node WHERE id = $1 AND author = $2 AND template = $3',
                  [ block.id, block.author, block.template ], function (err, result) {
                     done();
                     if(err)return fn(err, null);

                     return fn(null, result);

                  });
               });
         });
   });
};

Block.prototype.dropId = function (fn) {
   var block = this;

   pool.connect( function (err, client, done) {


      client.query('UPDATE layerandblock SET block_id = null WHERE block_id = $1',
         [ block.id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            client.query('DELETE FROM blockandsection WHERE block_id = $1',
               [ block.id ], function (err, result) {
                  done();
                  if(err)return fn(err, null);

               client.query('DELETE FROM node WHERE id = $1 AND template = $2',
                  [ block.id, block.template ], function (err, result) {
                     done();

                     if(err)return fn(err, null);

                     return fn(null, result);

               });
            });
      });
   });
};

Block.prototype.list = function (fn) {
   var block = this;
   
   if( conf.get('administrator' ) == block.email)block.users = 0;
   
   if( block.users == 1 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id as Редактирование, title as "Имя набора", alias as "Псевдоним набора", ' +
            '(SELECT title FROM node WHERE id = section_id) as "Раздел", id_blockandsection, date_create as "Дата создания", date_edit as "Дата правки", ' +
            'author as Автор, author_edit as "Автор правки", status as Статус, main as Главная, line as Приоритет ' +
            'FROM node LEFT OUTER JOIN blockandsection ON (id = block_id) WHERE template = $1 AND author = $2 ORDER BY id',
            [ block.template, block.email ], function (err, result) {
               done();
               if (err) {
                  return fn(err, null)
               } else {
                  return fn(null, result);
               }
            });
      });
      
   } else if( block.users == 0 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id as Редактирование, title as "Имя набора", alias as "Псевдоним набора", ' +
            '(SELECT title FROM node WHERE id = section_id) as "Раздел", id_blockandsection, date_create as "Дата создания", date_edit as "Дата правки", ' +
            'author as Автор, author_edit as "Автор правки", status as Статус, main as Главная, line as Приоритет  FROM node ' +
            'LEFT OUTER JOIN blockandsection ON (id = block_id) WHERE template = $1 ORDER BY id',
            [ block.template ], function (err, result) {
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

Block.prototype.getIdEmail = function (fn) {
   
   var block = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE id = $1 AND author = $2',
         [block.id, block.author], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Block.prototype.getId = function (fn) {
   
   var block = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE id = $1',
         [block.id], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};


Block.prototype.getSectionsId = function (fn) {

   var block = this;

   var template = 'section';

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id, title, alias, author FROM node WHERE template = $1 except ' +
         'SELECT id, title, alias, author FROM blockandsection, node WHERE section_id = id AND block_id = $2',
         [template, block.id], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });

   });
};

Block.prototype.getSectionsIdEmail = function (fn) {

   var block = this;
   var template = 'section';

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id, title, alias, author FROM node WHERE template = $1 AND author = $2 except ' +
         'SELECT id, title, alias, author FROM blockandsection, node WHERE section_id = id AND block_id = $3',
         [template, block.author, block.id], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Block.prototype.addBlockAndSection = function (fn) {

   var block = this;

   pool.connect( function (err, client, done) {

      client.query('INSERT INTO blockandsection ( block_id, section_id ) VALUES ($1, $2)',
         [ block.block_id, block.section_id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            return fn(null, result);

         });
   });
};

Block.prototype.getTableId= function (fn) {

   var block = this;

   pool.connect( function (err, client, done) {

      client.query('SELECT id as Редактирование, title as "Название раздела", alias as "Псевдоним раздела", author as "Автор", date_create as "Дата создания", ' +
         'author_edit as "Автор правки", date_edit as "Дата правки", status as "Статус", main as "Главная" ' +
         'FROM node JOIN blockandsection ON(id = section_id) WHERE block_id = $1',
         [ block.id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            return fn(null, result);

         });
   });
};

Block.prototype.dropSection = function (fn) {
   var block = this;

   pool.connect( function (err, client, done) {

      client.query('DELETE FROM blockandsection WHERE block_id = $1 AND section_id = $2',
         [ block.block_id, block.section_id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            return fn(null, result);

         });
   });
};


Block.prototype.getStrBlock = function (fn) {
   var block = this;

   if( block.author == 1 ){
      pool.connect( function (err, client, done) {

         client.query('SELECT block_id, author FROM blockandsection, node WHERE id = block_id AND id_blockandsection = $1 AND author = $2',
            [ block.id, block.author ], function (err, result) {
               done();

               if(err)return fn(err, null);

               return fn(null, result);

            });
      });

   } else {

      pool.connect( function (err, client, done) {

         client.query('SELECT block_id, author FROM blockandsection, node WHERE id = block_id AND id_blockandsection = $1',
            [ block.id ], function (err, result) {
               done();

               if(err)return fn(err, null);

               return fn(null, result);

            });
      });
   }
};

Block.prototype.getAllStrBlock = function (fn) {
   var block = this;

   if( block.author == 1 ){
      pool.connect( function (err, client, done) {

         client.query('SELECT block_id, author FROM blockandsection, node WHERE id = block_id AND block_id = $1 AND author = $2',
            [ block.block_id, block.author ], function (err, result) {
               done();

               if(err)return fn(err, null);

               return fn(null, result);

            });
      });

   } else {

      pool.connect( function (err, client, done) {

         client.query('SELECT block_id, author FROM blockandsection, node WHERE id = block_id AND block_id = $1',
            [ block.block_id ], function (err, result) {
               done();

               if(err)return fn(err, null);

               return fn(null, result);

            });
      });
   }
};

Block.prototype.deleteStrBlock = function (fn) {
   var block = this;

   pool.connect( function (err, client, done) {

      client.query('DELETE FROM blockandsection WHERE id_blockandsection = $1',
         [ block.id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            return fn(null, result);

         });
   });
};