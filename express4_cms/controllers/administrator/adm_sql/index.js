var SQL = require('./model/index');
var table = require('../../../lib/tableList');
var conf = require('../../../config');
var url = require('url');


exports.list = function (req, res, next) {

   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var trigger = '';

   function entrance() {

      if (conf.get('administrator') != req.session.uid) {
         res.redirect('/admin');
      } else {
         noend();
      }
   }

   function viewsQuery(){

      if(urlParsed.query.viewsQuery){

         SQL.getQuery(urlParsed.query.viewsQuery, function (err, result) {
            if (err) return next(err);
            
            if(result.rowCount == 1){
   
               res.repeatData({query: result.rows[0].query});
               res.redirect(pathname);
            
            } else {
               res.redirect(pathname);
            }
         })

      } else {
         noend();
      }
   }

   function saveQuery() {

      if(urlParsed.query.saveQuery){

         SQL.saveQueryNotebook (urlParsed.query.saveQuery, function (err, result) {
            if (err) return next(err);

            if(result.rowCount == 1){
               res.readyOk('Запрос добавлен в блокнот.');
               res.redirect(pathname);
            }
         })

      } else if(urlParsed.query.editQuery) {

         trigger = urlParsed.query.editQuery;

         SQL.getOneNotebook(urlParsed.query.editQuery, function (err, result) {
            if (err) return next(err);

            res.render('administrator/adm_sql', {

               triggerEditQuery: trigger,
               tableEditQuery: table.tableEditQuery(result),
               formEditQuery: result.rows[0]

            });

         });

      } else {

         noend();

      }
   }

   function deleteQuery() {


      if(urlParsed.query.dropQuery){

         SQL.deleteQueryArchive(urlParsed.query.dropQuery, function (err, result) {
            if (err) return next(err);

            if(result.rowCount == 1){
               res.readyOk('Запрос удалён.');
               res.redirect(pathname);
            }
         })

      } else {

         noend();
      }
   }

   function listRender() {

      SQL.getArchive(function (err, resultArchive) {
         if (err) return next(err);
   
   
         SQL.getNotebook(function (err, resultNotebook ){
            if (err) return next(err);
   
            var urlPage = urlParsed.query.page;
            var limit = 15;
            var linkLimit = 10;
            var offset = urlPage * limit - limit;
   
            if( offset < 0 || !offset) offset = 0;
            
            res.render('administrator/adm_sql', {
   
               table: '',
               archive: table.tableArchiveSQL(resultArchive),
               notebook: table.tableNotebookSQL(resultNotebook),
               triggerEditQuery: ''
   
            });
              
         });
      });
   }

   var tasks = [ entrance, viewsQuery, saveQuery, deleteQuery, listRender ];
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   noend();
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

exports.submit = function (req, res, next) {

   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var query = '';
   var error = null;
   var title = '';
   var trigger = '';
   var horizontally = null;
   
   function entrance() {
      
      if (conf.get('administrator') != req.session.uid) {
         res.redirect('/admin');
      } else {
         noend();
      }
   }
   
   function editQuery(){
   
      if (req.body.sql.editQuery) {
         
         var id_sql = urlParsed.query.editQuery;

         if(req.body.sql.tags.length > 60){
            res.error(req.body.sql.tags + ' - должно быть не боле 60 символов!');
            res.redirect('back');
         } else if(req.body.sql.tags == ' '){
            res.error(req.body.sql.tags + ' - не может быть пробелом!');
            res.redirect('back');
         } else if(req.body.sql.description.length > 1000){
            res.error(req.body.sql.description  + ' - должно быть не боле 1000 символов!');
            res.redirect('back');
         } else if(req.body.sql.description  == ' '){
            res.error(req.body.sql.description  + ' - не может быть пробелом!');
            res.redirect('back');
         } else if(req.body.sql.priority.length > 12){
            res.error(req.body.sql.priority  + ' - должно быть не боле 12 символов!');
            res.redirect('back');
         } else if(req.body.sql.priority  == ' '){
            res.error(req.body.sql.priority  + ' - не может быть пробелом!');
            res.redirect('back');
         } else {
            
            var editSQL = new SQL({
      
               id_sql: id_sql,
               tags: req.body.sql.tags.trim(),
               description: req.body.sql.description.trim(),
               priority: (req.body.sql.priority * 1)
      
            });
   
            editSQL.editSQL(function (err, result) {
               if (err) return next(err);
      
               if(result.rowCount == 1){
                  res.readyOk('Поля формы изменены.');
                  res.redirect('back');
               }
            })
         }
      }
   
      noend();
   }

   function createSQL(){
   
      var sqltable = '';

      if(req.body.sql.horizontally == 1) horizontally = 1;
      if(req.body.sql.horizontally == 0) horizontally = 0;
      
      if (req.body.sql.create) {

         query = req.body.sql.query;
         var hidden = req.body.sql.hidden;

         if (query == ' ') {
            res.error("Полe не может быть пробелом!");
            res.redirect('back');
         } else if (query.length < 1) {
            res.error("Полe обязательно для заполнения!");
            res.redirect('back');
         } else {

            query = query.trim();
   
            if( query.indexOf(';', query.length - 1) == query.length - 1 ){
               query = query.substring(0, query.length - 1);
            }

            SQL.resultQuery(query, function (err, result) {

            //console.log(result);

///////////////ERROR///////////////
               if (err) {
                  
                  error = err.message;

                  var sql = new SQL({
                     command: 'ERROR',
                     error: error,
                     query: query,
                     date: Date.now()
                  });
                  
                  sql.saveArchive(function (errSave, resultSave) {
                     if (errSave) return next(errSave);
                  
                     if(resultSave.rowCount != 1){
                        res.error("В архив не сохраняются запросы!");
                        res.redirect(pathname);
                     }

                     SQL.getArchive(function (errArchive, resultArchive) {
                        if (errArchive) return next(errArchive);

                        SQL.getNotebook(function (errNotebook, resultNotebook ){
                           if (errNotebook) return next(errNotebook);
                           
                           table.tableSQL(title, hidden, horizontally, query, error, result, function (err, result) {
                              if (err) return next(err);
                              sqltable = result;

                              res.render('administrator/adm_sql', {
   
                                 table: sqltable,
                                 archive: table.tableArchiveSQL(resultArchive),
                                 notebook: table.tableNotebookSQL(resultNotebook),
                                 triggerEditQuery: trigger
   
                              });
                           });

                        });

                     });

                  });
////////////////SELECT//////////////////////////////////////
               } else {

                  if (result.command == 'SELECT') {

                     title = '<h4><em>Строк</em>: <span class="res">'+ result.rowCount +'</span><br> <em>Запрос</em>: <span class="res">' + query + '</span></h4>\n';

                     var sql = new SQL({
                        command: result.command,
                        error: error,
                        query: query,
                        date: Date.now()
                     });

                     sql.saveArchive(function (errSave, resultSave) {
                        if (errSave) return next(errSave);

                        if(resultSave.rowCount != 1){
                           res.error("В архив не сохраняются запросы!");
                           res.redirect(pathname);
                        }

                        SQL.getArchive(function (errArchive, resultArchive) {
                           if (errArchive) return next(errArchive);

                           SQL.getNotebook(function (errNotebook, resultNotebook ){
                              if (errNotebook) return next(errNotebook);
                              
                              table.tableSQL(title, hidden, horizontally, query, error, result, function (err, result) {
                                 if (err) return next(err);
                                 sqltable = result;


                                 res.render('administrator/adm_sql', {

                                    table: sqltable,
                                    archive: table.tableArchiveSQL(resultArchive),
                                    notebook: table.tableNotebookSQL(resultNotebook),
                                    triggerEditQuery: trigger

                                 });
                              });
                           });
                        });
                     });
                  }
/////////////////DELETE INSERT UPDATE CREATE DROP////////////////////////////////

                  if(result.command == 'DELETE' || result.command == 'UPDATE' || result.command == 'DROP'
                     || result.command == 'INSERT' || result.command == 'CREATE' || result.command == 'ALTER') {

                     title = '<h4><em>Строк</em>: <span class="res">'+ result.rowCount +'</span><br> <em>Запрос</em>: <span class="res">' + query + '</span></h4>\n';

                     var sql = new SQL({
                        command: result.command,
                        error: error,
                        query: query,
                        date: Date.now()
                     });

                     sql.saveArchive(function (errSave, resultSave) {
                        if (errSave) return next(errSave);

                        if(resultSave.rowCount != 1){
                           res.error("В архив не сохраняются запросы!");
                           res.redirect(pathname);
                        }

                        SQL.getArchive(function (errArchive, resultArchive) {
                           if (errArchive) return next(errArchive);

                           SQL.getNotebook(function (errNotebook, resultNotebook ){
                              if (errNotebook) return next(errNotebook);
   
                              table.tableSQL(title, hidden, horizontally, query, error, result, function (err, result) {
                                 if (err) return next(err);
                                 sqltable = result;

                                    res.render('administrator/adm_sql', {
                                       
                                       table: sqltable,
                                       archive: table.tableArchiveSQL(resultArchive),
                                       notebook: table.tableNotebookSQL(resultNotebook),
                                       triggerEditQuery: trigger
                                    });     

                              });

                           });

                        });

                     });
                  }
/////////////////////////////////////////////////////////////////////
               }
            });
         }
      }

      noend();
   }

   var tasks = [ entrance, editQuery, createSQL];
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   noend();

};


