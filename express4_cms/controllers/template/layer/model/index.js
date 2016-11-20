var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Layer;

function Layer(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}


Layer.prototype.isset = function (fn) {
   
   var layer = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id FROM node WHERE alias = $1',
         [ layer.alias ], function (err, result) {
            done();
            if(err) return fn(err, null);
            
            
            if(result.rowCount == 1 && result.rows[0].id == layer.id){
               return fn(null, 1);
            } else if (result.rowCount == 1 && result.rows[0].id != layer.id){
               return fn(null, 0);
            } else {
               return fn(null, 1);
            }
         });
   });
   
};

Layer.prototype.save = function (fn) {
   
   var layer = this;

   layer.line = layer.line * 1;

   if( !layer.line ){
      layer.line = null;
   }

   pool.connect( function (err, client, done) {
         
         client.query('INSERT INTO node (title, alias, date_create, author, status, main, template, line) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [ layer.title, layer.alias, layer.date_create, layer.author, layer.status, layer.main, layer.template, layer.line ], function (err, result) {
               done();
               if(err)return fn(err, null);
      
               return fn(null, result);
               
         });
   });
   
};

Layer.prototype.editEmail = function (fn) {

   var layer = this;

   layer.line = layer.line * 1;

   if( !layer.line ){
      layer.line = null;
   }
   
   pool.connect( function (err, client, done) {
      
      client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, ' +
         'status = $5, main = $6, template = $7, line = $8 WHERE id = $9 AND author = $10',
         [ layer.title, layer.alias, layer.date_create, layer.author, layer.status, layer.main, layer.template, layer.line, layer.id, layer.author ], function (err, result) {
            done();

            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });

};

Layer.prototype.editId = function (fn) {
   
   var layer = this;

   layer.line = layer.line * 1;

   if( !layer.line ){
      layer.line = null;
   }
   
   pool.connect( function (err, client, done) {
      
      client.query('UPDATE node SET title = $1, alias = $2, date_edit = $3, author_edit = $4, ' +
         'status = $5, main = $6, template = $7, line = $8  WHERE id = $9',
         [ layer.title, layer.alias, layer.date_create, layer.author, layer.status, layer.main, layer.template, layer.line, layer.id ], function (err, result) {
            done();

            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Layer.prototype.dropEmail = function (fn) {
   var layer = this;

   pool.connect( function (err, client, done) {

      client.query('DELETE FROM layerandblock WHERE layer_id = $1',
         [ layer.id ], function (err, result) {
            done();

         if(err)return fn(err, null);

         client.query('DELETE FROM node WHERE id = $1 AND author = $2 AND template = $3',
            [ layer.id, layer.author, layer.template ], function (err, result) {

               done();
               if(err)return fn(err, null);

               return fn(null, result);

         });
      });
   });
};

Layer.prototype.dropId = function (fn) {
   var layer = this;

   pool.connect( function (err, client, done) {

      client.query('DELETE FROM layerandblock WHERE layer_id = $1',
         [ layer.id ], function (err, result) {
            done();

            if(err)return fn(err, null);

            client.query('DELETE FROM node WHERE id = $1 AND template = $2',
               [ layer.id, layer.template ], function (err, result) {
                  done();

                  if(err)return fn(err, null);

                  return fn(null, result);

               });

         });
   });
};

Layer.prototype.list = function (fn) {
   var layer = this;
   
   if( conf.get('administrator') == layer.email ) layer.users = 0;
   
   if( layer.users == 1 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id as Редактирование, title as "Название слоя", alias as "Псевдоним слоя", ' +
            '(SELECT title FROM node WHERE id = block_id) as "Блок", id_layerandblock, ' +
            'date_create as "Дата создания", date_edit as "Дата правки", author as Автор, author_edit as "Автор правки", ' +
            'status as Статус, main as Главная, line as Приоритет ' +
            'FROM node LEFT OUTER JOIN layerandblock block ON (id = layer_id) WHERE template = $1 AND author = $2 ORDER BY line DESC',
            [ layer.template, layer.email ], function (err, result) {
               done();
               if (err) {
                  return fn(err, null)
               } else {
                  return fn(null, result);
               }
            });
      });
      
   } else if( layer.users == 0 ){

      pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT id as Редактирование, title as "Название слоя", alias as "Псевдоним слоя", ' +
            '(SELECT title FROM node WHERE id = block_id) as "Блок", id_layerandblock, ' +
            'date_create as "Дата создания",  date_edit as "Дата правки", author as Автор, author_edit as "Автор правки", ' +
            'status as Статус, main as Главная, line as Приоритет FROM node LEFT OUTER JOIN layerandblock block ON (id = layer_id) ' +
            'WHERE template = $1 ORDER BY author, line DESC',
            [ layer.template ], function (err, result) {
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

Layer.prototype.getIdEmail = function (fn) {
   
   var layer = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE id = $1 AND author = $2',
         [layer.id, layer.author], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Layer.prototype.getId = function (fn) {
   
   var layer = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE id = $1',
         [layer.id], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
   
};

Layer.prototype.getBlocksId = function (fn) {

   var layer = this;

   var template = 'block';

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id, title, alias, author FROM node WHERE template = $1 except ' +
         'SELECT id, title, alias, author FROM layerandblock, node WHERE block_id = id AND layer_id = $2',
         [ template, layer.id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });

   });
};

Layer.prototype.getBlocksIdEmail = function (fn) {
   
   var layer = this;
   var template = 'block';
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
   
      client.query('SELECT id, title, alias, author FROM node WHERE template = $1 AND author = $2 except ' +
         'SELECT id, title, alias, author FROM layerandblock, node WHERE block_id = id AND layer_id = $3',
         [ template, layer.author, layer.id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);

         });
   });
};

Layer.prototype.addLayerAndBlock = function (fn) {
   
   var layer = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('INSERT INTO layerandblock ( layer_id, block_id ) VALUES ($1, $2)',
         [ layer.layer_id, layer.block_id ], function (err, result) {
            done();
            
            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Layer.prototype.getTableId= function (fn) {
   
   var layer = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('SELECT id as Редактирование, title as "Название блока", alias as "Псевдоним блока", author as "Автор", date_create as "Дата создания", ' +
         'author_edit as "Автор правки", date_edit as "Дата правки", status as "Статус", main as "Главная" ' +
         'FROM node JOIN layerandblock ON(id = block_id) WHERE layer_id = $1',
         [ layer.id ], function (err, result) {
            done();
            
            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Layer.prototype.dropBlock = function (fn) {
   var layer = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('DELETE FROM layerandblock WHERE layer_id = $1 AND block_id = $2',
         [ layer.layer_id, layer.block_id ], function (err, result) {
            done();
            
            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

Layer.prototype.getStrLayer = function (fn) {
   var layer = this;
   
   if(layer.author == 1){
      pool.connect( function (err, client, done) {
         
         client.query('SELECT layer_id, author FROM layerandblock, node WHERE id = layer_id AND id_layerandblock = $1 AND author = $2',
            [ layer.id, layer.author ], function (err, result) {
               done();
               
               if(err)return fn(err, null);
               
               return fn(null, result);
               
            });
      });
      
   } else {

      pool.connect( function (err, client, done) {
         
         client.query('SELECT layer_id, author FROM layerandblock, node WHERE id = layer_id AND id_layerandblock = $1',
            [ layer.id ], function (err, result) {
               done();
               
               if(err)return fn(err, null);
               
               return fn(null, result);
               
            });
      });
   }
};

Layer.prototype.getAllStrLayer = function (fn) {
   var layer = this;
   
   if( layer.author == 1 ){
      pool.connect( function (err, client, done) {
         
         client.query('SELECT layer_id, author FROM layerandblock, node WHERE id = layer_id AND layer_id = $1 AND author = $2',
            [ layer.layer_id, layer.author ], function (err, result) {
               done();
               
               if(err)return fn(err, null);
               
               return fn(null, result);
               
            });
      });
      
   } else {

      pool.connect( function (err, client, done) {
         
         client.query('SELECT layer_id, author FROM layerandblock, node WHERE id = layer_id AND layer_id = $1',
            [ layer.layer_id ], function (err, result) {
               done();
               
               if(err)return fn(err, null);
               
               return fn(null, result);
               
            });
      });
   }
};

Layer.prototype.deleteStrLayer = function (fn) {
   var layer = this;
   
   pool.connect( function (err, client, done) {
      
      client.query('DELETE FROM layerandblock WHERE id_layerandblock = $1',
         [ layer.id ], function (err, result) {
            done();
            
            if(err)return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};