var url = require('url');
var conf = require('../../../config');
var Template = require('./model/index');
var table = require('../../../lib/tableList');
var menu = require('../../../lib/menu');

exports.list = function (req, res, next) {
   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var trigger = '';
   var userRightMenu = '';
   var tableTemplate = '';
   var resultLesson = '';
   
   function accessAdministrator() {

      if (conf.get('administrator') != req.session.uid) {
         res.redirect('/admin');
      } else {
         noend();
      }
   }

   function userMenu() {

      menu.adminRightMenu( null, req.session.uid, function (err, result) {
         if (err) return next(err);

         userRightMenu = result;

         noend();
      });
   }
   
   function getTableTemplate() {

      var template = new Template({});

      template.getTemplateSort(function (err, result) {
         if (err) return next(err);

         tableTemplate = result;

         noend();

      });
   }
   
   function updateTemplateSort(){

      if(urlParsed.query.name && urlParsed.query.sort){
         
         var templateUpdate = new Template({
            template: urlParsed.query.name,
            template_sort: urlParsed.query.sort
         });
   
         templateUpdate.setTemplateSort(function (err, result) {
            if (err) return next(err);

            if(result.rowCount > 0){
               res.redirect(pathname);
            } else {
               res.error("Правка записи не удалась!");
               res.redirect(pathname);
            }
         })

      } else {
         noend();
      }
   }

   function listRender() {
   
      /////////////////////////////////////////////////
      var lesson = new Template({name_role: urlParsed.query.lesson});

      lesson.Lesson(function (err, result) {
         if (err) return next(err);
         resultLesson = result;
      });
      /////////////////////////////////////////////////


      setTimeout(function () {
         res.render('administrator/adm_template', {
            title: "Настройка шаблонов",
            userRightMenu: userRightMenu,
            tableTemplate: table.tableTemplate(tableTemplate),
            tableLesson: table.tableLesson(resultLesson),

            permit: '',
            table: ''
         });
      }, 100)

   }
   
   
   var tasks = [ accessAdministrator, userMenu, getTableTemplate, updateTemplateSort, listRender ];

   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }

   noend();

};