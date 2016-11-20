var conf = require('../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);
var co = require("co");
var async = require('async');

exports.adminRightMenu = function ( users, email, fn ) {

   var str = '';
   var idRole = null;
   var code = '';
   var obj = {};


   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      if( users == null ){

         client.query('SELECT id_permit, temp, name, id, title, url_temp FROM ' +
            'permit LEFT OUTER JOIN sectionandtemplate ON(temp = template_name) ' +
            'LEFT OUTER JOIN node ON(section_id = id) ORDER BY priority DESC', function (err, result) {
            done();

            if (err) return fn(err, null);

            if(result.rowCount > 0) {


               for(var j = 0; j < result.rows.length; j++){

                  obj['<a href = "' + result.rows[j].url_temp + '">' + result.rows[j].name + '</a>'] = {};

               }


               for(var t = 0; t < result.rows.length; t++){

                  if(result.rows[t].title){

                     obj['<a href = "' + result.rows[t].url_temp + '">' + result.rows[t].name + '</a>']
                        ['<a href = "' + result.rows[t].url_temp + '?section=' + result.rows[t].id + '">' + result.rows[t].title + '</a>'] = {};

                  }
               }

            } else {
               obj = {};
            }


            str += createTreeText(obj);

            fn(null, str);

         });

      }

      if( users == 0 ){

         client.query('SELECT * FROM users WHERE email = $1', [email], function (err, result) {
            done();

            if (err) return fn(err, null);

            idRole = result.rows[0].role_id;


            client.query('SELECT id_permit, temp, name, id, title, url_temp FROM ' +
               'permit LEFT OUTER JOIN sectionandtemplate ON(temp = template_name) ' +
               'LEFT OUTER JOIN node ON(section_id = id) ORDER BY priority DESC', function (err, result) {
               done();

               if (err) return fn(err, null);

               if(result.rowCount > 0) {

                  function fooMap(val, callback) {

                     client.query('SELECT code FROM access WHERE role_id = $1 AND permit_id = $2',
                        [ idRole, val.id_permit ], function (err, resRole) {
                           done();
                           if (err) return fn(err, null);

                           return callback(err, resRole.rows[0].code)

                        });
                  };

                  async.map(result.rows, fooMap, function (err, results) {
                     if (err) return fn(err, null);
                     code = results;

                     client.query('SELECT id_permit, temp, name, id, title, url_temp, temp_sort FROM ' +
                        'permit LEFT OUTER JOIN sectionandtemplate ON(temp = template_name) ' +
                        'LEFT OUTER JOIN node ON(section_id = id) ORDER BY priority DESC', function (err, result) {
                        done();

                        if (err) return fn(err, null);

                        if(result.rowCount > 0) {

                           for(var j = 0; j < result.rows.length; j++){

                              if(code[j] != '00000'){

                                 if( code[j].indexOf('1', 0) == 0 || result.rows[j].temp_sort == 0 ){

                                    obj['<a href = "' + result.rows[j].url_temp + '">' + result.rows[j].name + '</a>'] = {};

                                 } else {

                                    obj[ result.rows[j].name ] = {};

                                 }

                              }
                           }

                           for(var t = 0; t < result.rows.length; t++){

                              if(code[t] != '00000') {

                                 if (result.rows[t].title) {

                                    if( code[t].indexOf('1', 0) == 0 || result.rows[t].temp_sort == 0 ){

                                       obj['<a href = "' + result.rows[t].url_temp + '">' + result.rows[t].name + '</a>']
                                          ['<a href = "' + result.rows[t].url_temp + '?section=' + result.rows[t].id + '">' + result.rows[t].title + '</a>'] = {};

                                    } else {

                                       obj[ result.rows[t].name  ]
                                          ['<a href = "' + result.rows[t].url_temp + '?section=' + result.rows[t].id + '">' + result.rows[t].title + '</a>'] = {};

                                    }

                                 }
                              }
                           }

                        } else {
                           obj = {};
                        }

                        str += createTreeText(obj);

                        fn(null, str);

                     });
                  });
               }
            });
         });
      }

      if( users == 1 ){

         client.query('SELECT id_role FROM role WHERE users = $1', [ 1 ], function (err, result) {
	         done();

	         if (err) return fn(err, null);

	         if (result.rowCount > 0) {

		         idRole = result.rows[0].id_role;

		         client.query('SELECT id_permit, temp, name, id, title, url_temp FROM ' +
			         'permit LEFT OUTER JOIN sectionandtemplate ON(temp = template_name) ' +
			         'LEFT OUTER JOIN node ON(section_id = id) ORDER BY priority DESC', function (err, result) {
			         done();

			         if (err) return fn(err, null);

			         if (result.rowCount > 0) {

				         function fooMap(val, callback) {

					         client.query('SELECT code FROM access WHERE role_id = $1 AND permit_id = $2',
						         [idRole, val.id_permit], function (err, resRole) {
							         done();
							         if (err) return fn(err, null);
										if(resRole.rowCount > 0){
											return callback(err, resRole.rows[0].code);
										} else {
											return callback(err, '00000');
										}
						         });
				         }

				         async.map(result.rows, fooMap, function (err, results) {
					         if (err) return fn(err, null);
					         code = results;

					         client.query('SELECT id_permit, temp, name, id, title, url_temp, temp_sort FROM ' +
						         'permit LEFT OUTER JOIN sectionandtemplate ON(temp = template_name) ' +
						         'LEFT OUTER JOIN node ON(section_id = id) ORDER BY priority DESC', function (err, result) {
						         done();

						         if (err) return fn(err, null);

						         if (result.rowCount > 0) {

							         for (var j = 0; j < result.rows.length; j++) {

								         if (code[j] != '00000') {

									         if (code[j].indexOf('1', 0) == 0 || result.rows[j].temp_sort == 0) {

										         obj['<a href = "' + result.rows[j].url_temp + '">' + result.rows[j].name + '</a>'] = {};

									         } else {

										         obj[result.rows[j].name] = {};

									         }

								         }
							         }

							         for (var t = 0; t < result.rows.length; t++) {

								         if (code[t] != '00000') {

									         if (result.rows[t].title) {

										         if (code[t].indexOf('1', 0) == 0 || result.rows[t].temp_sort == 0) {

											         obj['<a href = "' + result.rows[t].url_temp + '">' + result.rows[t].name + '</a>']
												         ['<a href = "' + result.rows[t].url_temp + '?section=' + result.rows[t].id + '">' + result.rows[t].title + '</a>'] = {};

										         } else {

											         obj[result.rows[t].name]
												         ['<a href = "' + result.rows[t].url_temp + '?section=' + result.rows[t].id + '">' + result.rows[t].title + '</a>'] = {};

										         }

									         }
								         }
							         }

						         } else {
							         obj = {};
						         }

						         str += createTreeText(obj);

						         fn(null, str);

					         });
				         });

			         } else {
				         fn(null, '');
			         }
		         });

            } else {
		         fn(null, '');
	         }
         });
      }

   });

};
   

function createTreeText(obj) {

   var li = '';


   for (var key in obj) {

      li +='\t' + '<li>' + key + createTreeText(obj[key]) + '</li>' + '\n';

   }

   if (li) {


      var ul = '\n';

      ul += '<ul>' + '\n';

      ul += li;

      ul += '</ul>' + '\n';

   }

   return ul || '';
}