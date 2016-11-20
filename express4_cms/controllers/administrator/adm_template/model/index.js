var conf = require('../../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Template;

function Template(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Template.prototype.getTemplateSort = function (fn) {
   var template = this;
   
   pool.connect( function (err, client, done) {
         if (err) return fn(err);
         
         client.query('SELECT temp as Шаблоны, temp_sort as "Принадлежность шаблона" FROM permit ORDER BY temp', 
            function (err, result) {
               done();
               if (err) return fn(err, null);
               
               fn(null, result);
            });
      });
};

Template.prototype.setTemplateSort = function (fn) {
   var template = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('UPDATE permit SET temp_sort = $1 WHERE temp = $2',
         [ template.template_sort,  template.template], function (err, result) {
         done();
         if (err) return fn(err, null);
         
         fn(null, result);
      });
   });
};


Template.prototype.Lesson = function (fn) {
   var template = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id_role, name_role FROM role WHERE name_role = $1',
         [ template.name_role ], function (err, result) {
            done();
            if (err) return fn(err, null);

            fn(null, result);
         });
   });
};