var async = require("async");
var co = require("co");
var testMenu = require('./model/index');
var table = require('../../../lib/tableList');
var menu = require('../../../lib/menu');
var Permit = require('../../../lib/permit');
var url = require('url');

var pg = require('pg');
var conf = require('../../../config');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);


exports.list = function (req, res, next) {

   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var temp = '';
   var nameSection = '';
   var resultList = '';
   var formValue = '';
   var menuList = '';
   var permission = '00000';
   var users = null;
   var action = '';
   var userRightMenu = '';
   var permitForm = '';
   var titlePage = '';
   var trigger = '';
   var sectionTitle = '';
   var select = '';

   function getSection() {

      Permit.getSection( pathname, function (err, result) {
         if (err) return next(err);

         if(result.rowCount == 1){

            temp = result.rows[0].temp;
            nameSection = result.rows[0].name;

            noend();

         } else {

            noend();
         }
      });
   }

   function initialization() {

      if (!req.session.uid) {

         res.redirect('/admin/login');

      } else {

         if (req.admin == req.session.uid) {

            var permit = new Permit({
               url: pathname,
               email: req.session.uid
            });

            permit.init(function (err, result) {
               if (err) return next(err);

               if(result.command == 'SELECT'){

                  permit.form(function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount != 0) {

                        permitForm = result;
                        noend();
                     }
                  });
               }

               if (result.command == 'INSERT') {
                  res.redirect(pathname);
               }

               if (result.command == 'UPDATE') {

                  permit.form(function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount != 0) {
                        permitForm = result;
                        noend();
                     }
                  });
               }
            });

         } else {

            if (!temp) {
               return next();
            }

            noend();
         }
      }
   }

   function accessValue() {

      var permit = new Permit({
         url: urlParsed.pathname,
         email: req.session.uid
      });

      permit.accessModerator(function (err, result) {
         if (err) return next(err);

         if (req.admin != req.session.uid) {

            if (result.rows[0].role_id == null) {
               users = 1;
            } else {
               users = 0;
            }
         }

         permit.access(function (err, result) {
            if (err) return next(err);

            permission = result;

            noend();
         });
      });
   }

   function userMenu() {

      menu.adminRightMenu(users, req.session.uid, function (err, result) {
         if (err) return next(err);

         userRightMenu = result;

         noend();
      });
   }

   function listMenu() {

      var menu_list = new testMenu({});

      menu_list.menu_List(function (err, result) {
         if (err) return next(err);
         
         if(result.rowCount > 0){

            select = putinSelect(result.rows, urlParsed.query.putin);

            menuList = table.tableListMenu( result, permission );

            noend();
         } else {
            noend();
         }
      });
   
   }

   function listLi() {
      var li = '';

      var j = null;


      var blockSection = new testMenu({});

      blockSection.getBlockSection(function (err, result) {
         if (err) return next(err);

         if(result.rowCount > 0){

            for(var i = 0; i < result.rows.length; i++){

               var node = new testMenu({id: result.rows[i].section_id});


               node.getOneSection(function (err, resultNode) {
                  if (err) return next(err);

                  li += '\t' + '<li>' + resultNode.rows[0].title + '</li>' + '\n';

                  j = 1;



                  if (j){

                     liMenu(resultNode.rows[0].id, function (err, resultLi) {
                        if (err) return next(err);

                        li += resultLi;

                        j=null;

                     });

                  }

               });


            }


            setTimeout(function () {
               //console.log(li);
            }, 200);


            noend();

         } else {
            noend();
         }

      });

   }

   function liMenu(id, fn) {

      var li = '';

      var strLi = new testMenu({id:id});

      strLi.getLi(function (err, result) {
         if (err) return next(err);

         if( result.rowCount > 0 ){

            for( var i = 0; i < result.rows.length; i++ ){

               li += '\t' + '<li>' + result.rows[i].title;

               liMenu(result.rows[i].id, function (err, resultLi) {
                  li += resultLi;
               });

               li += '</li>' + '\n';

            }
         }

         return fn(null, li);

      });





/*      var li = '';

      for( var i = 0; i < obj.length; i++ ){

         li +='\t' + '<li>' + obj[i]['Название раздела'] + '</li>' + '\n';

      }

      if (li) {

         var ul = '\n';

         ul += '<ul>' + '\n';

         ul += li;

         ul += '</ul>' + '\n';

      }

      return ul;*/
   }
   

/*   function menuLi(){

      function recursion(id) {

         function mapRecursion(val, callback) {

            return callback( null, val.title);

         }

         var getSection = new testMenu({id:id});

         getSection.getSection(function (err, result) {
            if (err) return next(err);

            async.map(result.rows, mapRecursion, function (err, results) {
               if (err) return next(err);

               console.log(results);

            });

         });
      }


      var firstList = new testMenu({});

      firstList.firstList(function (err, result) {
         if (err) return next(err);

         async.map(result.rows, beforeRecursion, function (err, results) {
            if (err) return next(err);

            function fooRecursion(val, callback) {

               recursion( val[0].id );

               return callback( null, val[0].title);

            }


            async.map(results, fooRecursion, function (err, results) {
               if (err) return next(err);

               console.log(results);

            });

         });

      });

      function beforeRecursion(val, callback) {

         pool.connect( function (err, client, done) {
            if (err) callback(err);

            client.query('SELECT * FROM node WHERE id = $1',
               [ val.section_id ], function (err, result) {
                  done();
                  if (err) return callback(err, null);

                  return callback(null, result.rows);
               });
         });

      }


      noend();
   }*/


   function menuLi(){


      var firstList = new testMenu({});

      firstList.firstList(function (err, result) {
         if (err) return next(err);

         async.eachSeries(result.rows, iterateeFirstList);

         function iterateeFirstList( val, callback ) {

            var nodeID = new testMenu({id:val.section_id});

            nodeID.getOneSection(function (err, result) {

               if(result.rowCount > 0){

                  async.series([

                     function (call) {
                        console.log(result.rows[0].title);
                        call();
                     },

                     function (call) {

                        recursion(result.rows[0].id, function (err, results) {

                           console.log(results);

                        });

                        setTimeout(function () {
                           call();
                        }, 50)
                     },

                     function (call) {
                        callback();
                        call();
                     }

                  ]);

               }

            });
         }

      });


      function recursion(id, fn) {

         var section = new testMenu({section:id});

         section.getLiRecursion (function (err, result) {

            if(result.rowCount > 0) {

               async.eachSeries(result.rows, iterateeFoo);

               function iterateeFoo(val, callback) {

                  fn(null, val.title);

                  recursion(val.id, fn);

                  callback();

               }
            }

         });

      }

      noend();

   }








   function menuLi_1() {


      var firstList = new testMenu({});

      
      async.waterfall([
         
         function (callback) {

            firstList.firstList(function (err, result) {

               if (err){

                  callback(err);

               } else {

                  callback( null, result )
               }


            });
            
         },

         function (result, callback) {

            var first = null;

            async.eachSeries(result.rows, function (val, callback) {

               var nodeID = new testMenu({id:val.section_id});

               nodeID.getOneSection(function (err, result) {

                  if (err){

                     callback(err);

                  } else {

                     console.log(result.rows[0].title);

                     callback()

                  }


               }, function (err) {

                  if(err){

                     return next(err);

                  }

               });


            });


         }
         
         
      ], 
         
         
         
         
      function (err, result) {

         if(err){

            return next(err);

         } else {

            console.log(result);

            noend();
         }
         
      });

      noend();

   }







/*
   function menuLi(){

      co(function * () {
         var client = yield pool.connect();

         var result = yield client.query('SELECT *, (SELECT title FROM node WHERE id = section_id) as section_name ' +
            'FROM node JOIN blockandsection ON(block_id = id)');


         console.log(result.rows.length);


         for(var i = 0; i < result.rows.length; i++){

            console.log(result.rows[i].section_id);

            var result1 = yield client.query('SELECT * FROM node WHERE id = $1', [ result.rows[i].section_id ]);
            client.release();

            console.log(result1.rows);


         }



      });






      noend();
   }

 */













   function editPutin(){
   
      if (urlParsed.query.putin) {

         if (permission.indexOf('1', 2) == 2) {
            trigger = 'putin';
            
            var oneSection = new testMenu({id:urlParsed.query.putin});

            oneSection.getOneSection(function (err, result) {
               if (err) return next(err);
               
               if(result.rowCount > 0){
                  
                  sectionTitle = result.rows[0];
                  noend();
               
               } else {
                  noend();
               }
            });
         
         } else {
            noend();
         }

      } else {
         noend();
      }
   }


   function listRender() {


      res.render('template/testMenu',
         {
            urlPage: req.url,
            title: titlePage,
            sectionTitle: sectionTitle,
            formValue: formValue,
            permit: permitForm,
            action: action,
            select: select,
            trigger: trigger,
            permission: permission,
            userRightMenu: userRightMenu,
            template: temp,
            menuList: menuList,

            table: resultList
         }
      );

   }

   var tasks = [ getSection, initialization, accessValue, userMenu, listMenu, listLi, menuLi_1, editPutin, listRender ];

   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }

   noend();


};

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

exports.submit = function ( req, res, next ) {

   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var permission = '00000';
   var users = null;
   var temp = '';
   var nameSection = '';
   var value = '';

   function getSection() {

      Permit.getSection( pathname, function (err, result) {
         if (err) return next(err);

         if(result.rowCount == 1){

            temp = result.rows[0].temp;
            nameSection = result.rows[0].name;
            value = req.body[temp];

            noend();

         } else {
            return next();
         }
      });
   }

   function initialization() {
      if (!req.session.uid) {

         res.redirect('/admin/login');

      } else {


         var permit = new Permit({
            url: pathname,
            email: req.session.uid,
            submit: req.body
         });

         permit.init(function (err, result) {
            if (err) return next(err);

            if (result.rowCount == 1 && result.command == 'UPDATE') {

               res.readyOk('Права доступа адреса изменены.');
               res.redirect(pathname);

            } else {
               noend();
            }
         });
      }
   }

   function accessValue() {

      var permit = new Permit({
         url: urlParsed.pathname,
         email: req.session.uid
      });

      permit.accessModerator(function (err, result) {
         if (err) return next(err);

         if (req.admin != req.session.uid) {

            if (result.rows[0].role_id == null) {
               users = 1;
            } else {
               users = 0;
            }
         }

         permit.access(function (err, result) {
            if (err) return next(err);

            permission = result;

            noend();
         });
      });
   }

   function submitAccess() {

      if (value.selectPutin) {
         if (permission.indexOf('1', 2) == 2) {
            noend();
         } else {
            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }

      } else {
         res.redirect(pathname);
      }
   }

   function submitEdit() {

      if (value.editPutin) {

         var edit = new testMenu({

            put: value.selectPutin,
            in: urlParsed.query.putin

         });

         edit.putIn(function (err, result) {
            if (err) return next(err);

            if(result.rowCount > 0){
               res.redirect(pathname);
            } else {
               res.redirect(pathname);
            }
         })

      } else {
         res.redirect(pathname);
      }

   }


   var tasks = [ getSection, initialization, accessValue, submitAccess, submitEdit ];

   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }

   noend();

};

function putinSelect(sections, putin) {


   var str = '';

   if(sections.length == 0){

      str += '<option value="">Нет раздела</option>' + '\n';

   } else {

      for(var i = 0; i < sections.length; i++){

         if(putin != sections[i].id)str += '<option value="' + sections[i].id + '">' + sections[i]['Название раздела'] + '</option>' + '\n';
      }
   }

   return str;

}