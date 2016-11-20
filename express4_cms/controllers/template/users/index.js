var Auth = require('../../auth/model/index');
var Users = require('./model/index');
var table = require('../../../lib/tableList');
var menu = require('../../../lib/menu');
var dataFormat = require('../../../lib/dataFormat');
var Permit = require('../../../lib/permit');
var url = require('url');

exports.list = function (req, res, next) {
   
   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var temp = '';
   var nameSection = '';
   var resultList = '';
   var permission = '00000';
   var users = null;
   var userRightMenu = '';
   var permitForm = '';
   
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
         url: pathname,
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

   function listAccess() {

      if (urlParsed.query.drop) {
         if (permission.indexOf('1', 1) == 1) {
            noend();
         } else {
            res.error("У Вас нет прав на удаление!");
            res.redirect(pathname);
         }
      } else {
         noend();
      }
   }

   function dropUser() {
      
      if( urlParsed.query.drop ){
         
         var dropID = urlParsed.query.drop.trim();
      
         var drop = new Users({
            id_user: dropID
         });
      
         drop.getUserID(function (err, result) {
            if (err) return next(err);
            if(result.rowCount == 1){
               var emailUser = result.rows[0].email;
            } else {
               res.error("Нет такого пользователя!");
               res.redirect(pathname);
            }

            drop.drop(function (err, result) {
               if (err) return next(err);

               if(result.rowCount == 1){
                  
                  if(emailUser == req.session.uid){
                     res.redirect('/admin/logout');
                  } else {
                     res.readyOk('Учётные данные пользователя удалены.');
                     res.redirect(pathname);
                  }
               } 
            });
         });
      
      } else {
         
         noend();
      }
   }
   
   
   function listRender() {

      var users = new Users({});

      users.list(function (err, result) {
         if (err) return next(err);

         resultList = result;


         var urlPage = urlParsed.query.page;
         var limit = 15;
         var linkLimit = 10;
         var offset = urlPage * limit - limit;
   
         if( offset < 0 || !offset) offset = 0;


         Users.listLimit(limit, offset, function ( err, result ) {

            if (err) return next(err);

            var resultLimit = result;



            res.render( 'template/' + temp,
               {
                  title: nameSection,
                  tableUsers: table.tableListUsers(permission, resultList, urlParsed, limit, linkLimit, urlPage, resultLimit),
                  permit: permitForm,
                  userRightMenu: userRightMenu,
                  permission: permission,
                  template: temp,
                  table: ''
               }
            );
         });
      });
   }   
   

   var tasks = [ getSection, initialization, accessValue, userMenu, listAccess, dropUser, listRender];
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   noend();
};

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

exports.submit = function (req, res, next) {
   
   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var permission = '00000';
   var users = null;
   var temp = '';
   var nameSection = '';


   function getSection() {

      Permit.getSection( pathname, function (err, result) {
         if (err) return next(err);
         
         if(result.rowCount == 1){

            temp = result.rows[0].temp;
            nameSection = result.rows[0].name;

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
         url: pathname,
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

      if (req.body.users.create) {
         if (permission.indexOf('1', 3) == 3) {
            noend();
         } else {
            res.error("У Вас нет прав на добавления пользователя!");
            res.redirect(pathname);
         }

      } else {
         res.redirect(pathname);
      }
   }

   function submitCreateUser() {

      var valid = validateUser(res, req.body.users.email, req.body.users.pass);

      if (valid == true) {

         var submitEmail = req.body.users.email.trim();
         var submitPass = req.body.users.pass.trim();

         if (req.body.users.create == 'Добавить пользователя') {


            Users.getEmail(submitEmail, function (err, result) {
               if (err) return next(err);

               if (result.rowCount == 1) {
                  res.error(submitEmail + " - данный email уже существует!");
                  res.redirect('back');
               } else {

                  var auth = new Auth({
                     email: submitEmail,
                     pass: submitPass,
                     login: dataFormat.emailLogin(submitEmail),
                     date_registration: Date.now()
                  });

                  auth.save(function (err, result) {
                     if (err) return next(err);
                     if (result != 0) {

                        res.readyOk('Учётные данные пользователя сохранены.');
                        res.redirect('back');

                     } else {

                        res.error("Учётные данные пользователя не сохранились, произошла ошибка при записи в базу данных!");
                        res.redirect('back');
                     }
                  });
               }
            });
         }
      }
   }

   var tasks = [getSection, initialization, accessValue, submitAccess, submitCreateUser];
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   noend();

};




function validateUser(res, submitEmail, submitPass) {
   
   if (!submitEmail || !submitPass) {

      res.error("Поле обязательно для заполнения!");
      res.redirect('back');

   } else if (!(submitEmail.indexOf('.') > 0 && submitEmail.indexOf('@') > 0) || /[^a-zA-Z0-9.@_-]/.test(submitEmail)) {
      
      res.error(submitEmail + ' - электронный адрес имеет неверный формат!');
      res.repeatData({email: submitEmail, pass: submitPass});
      res.redirect('back');
      
   } else if (submitPass.length > 12) {
      
      res.error(submitPass + ' - должно быть не более 12 символов!');
      res.repeatData({email: submitEmail, pass: submitPass});
      res.redirect('back');

   } else if (submitPass == ' ') {

      res.error('Поле \'Пароль\' не может быть пробелом!');
      res.repeatData({email: submitEmail, pass: submitPass});
      res.redirect('back');

   } else {
      return true;
   }
}