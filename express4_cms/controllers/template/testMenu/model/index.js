var conf = require('../../../../config');
var pg = require('pg');
var co = require("co");
var async = require('async');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = testMenu;

function testMenu(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

testMenu.prototype.menu_List = function (fn) {
   var testmenu = this;
   
   testmenu.template = "section";
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT block_id, (SELECT title FROM node WHERE id = block_id) as block_name, ' +
         'id, title as "Название раздела", alias, section, line as "Приоритет" FROM node LEFT OUTER JOIN blockandsection ON (id = section_id) ' +
         'WHERE template = $1 ORDER BY block_id',
         [ testmenu.template ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
         });
   });
};



testMenu.prototype.putIn = function (fn) {
   var testmenu = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('UPDATE node SET section = $1 WHERE id = $2',
         [ testmenu.put, testmenu.in ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
         });
   });
};

testMenu.prototype.getLi = function (fn) {
   var testmenu = this;
   testmenu.temp = 'section';
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE section = $1 AND template = $2',
         [ testmenu.id,  testmenu.temp ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
            
         });
   });
};

testMenu.prototype.getLiRecursion = function (fn) {

   var testmenu = this;
   
   testmenu.temp = 'section';
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE section = $1 AND template = $2',
         [ testmenu.section,  testmenu.temp ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
            
         });
   });
};

testMenu.prototype.getBlockSection = function (fn) {

   var testmenu = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node JOIN blockandsection ON(block_id = id) ORDER BY id DESC',
         function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
         });
   });
};
///////////////////////////////////////
///////////////////////////////////////

testMenu.prototype.BlockID = function () {


/*   co(function * () {

      var client = yield pool.connect();

      var result = yield client.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name FROM node JOIN blockandsection ON(block_id = id)');
      client.release();

      return result;

   })*/

   var testmenu = this;

   
   async.series([
      
      function (callback) {
         
      },
   
   
      function (callback) {
      
      
      
      
      }
      
      
      
      
   ]);
   
   
   var a = pool.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name FROM node JOIN blockandsection ON(block_id = id)');


   var b = a.then(

      function (res) {
         return res;
      }
   );



      console.log(b);








};


testMenu.prototype.firstList = function (fn) {
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name FROM node JOIN blockandsection ON(block_id = id)',
         function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
         });
      
      
   });
};


testMenu.prototype.getOneSection = function (fn) {
   var testmenu = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node WHERE id = $1',
         [ testmenu.id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
         });
   });
};
   
   
testMenu.prototype.getSection = function (fn) {
   
   var testmenu = this;

   var template = 'section';
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node WHERE section = $1 AND template = $2',
         [ testmenu.id, template ], function (err, result) {
            done();

            if (err) return fn(err, null);
            
            return fn(null, result);
         });


   });
};


