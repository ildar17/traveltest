var conf = require('../../../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

module.exports = Site;

function Site(obj) {
   for (var key in obj) {
      this[key] = obj[key];
   }
}

Site.prototype.main_Query = function (fn) {

   var site = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT id, template FROM node WHERE alias = $1',
         [ site.keyRequest ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
         });
   });

};

Site.prototype.article_Page = function (fn) {
   
   var site = this;
   
   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      
      client.query('SELECT * FROM node JOIN article ON(id = node_id) WHERE id = $1',
         [ site.id ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
         });
   });
   
};


Site.prototype.catalog_Page = function (fn) {

   var site = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node JOIN catalog ON(id = node_id) WHERE id = $1',
         [ site.id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
         });
   });

};

Site.prototype.basic_Page = function (fn) {

   var site = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node JOIN basic ON(id = node_id) WHERE id = $1',
         [ site.id ], function (err, result) {
            done();
            if (err) return fn(err, null);
            
            return fn(null, result);
         });
   });

};

Site.prototype.section_TemplateName = function (fn) {

   var site = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT id, title, template_name, one_page, id_one_page FROM node ' +
         'JOIN sectionandtemplate ON(id = section_id) WHERE id = $1',
         [ site.id ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
         });
   });

};

Site.prototype.section_List = function (fn) {

   var site = this;

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query('SELECT * FROM node WHERE section = $1 AND template = $2',
         [ site.section, site.template ], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result);
         });
   });

};

