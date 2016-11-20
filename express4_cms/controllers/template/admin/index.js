var Admin = require('./model/index');
var ms = require('../../../lib/msDate');
var menu = require('../../../lib/menu');
var table = require('../../../lib/tableList');
var conf = require('../../../config/index');
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
      
      menu.adminRightMenu( users, req.session.uid, function (err, result) {
         if (err) return next(err);
         
         userRightMenu = result;
         
         noend();
      });
   }
   
   function tableAccess() {
      
      Admin.getAccess(req.session.uid, users, function (err, result) {
         if (err) return next(err);
         
         var accessUser = result;
         
         noend(accessUser);
         
      });
      
   }
   
   function listUser(accessUser) {

      var admin = new Admin({
         email: req.session.uid
      });
      
      admin.getUser(function (err, result) {
         if (err) return next(err);

         if (result.rowCount == 1) {

            resultList = result.rows[0];

            noend(accessUser);
         }
      });
   }
   
   function listRender(accessUser) {
      
      res.render('template/admin',
         {
            id_user: resultList.id_user,
            dateReg: ms.msDate(resultList.date_registration),
            title: nameSection,
            email: resultList.email,
            emailAdmin: conf.get('administrator'),
            login: resultList.login,
            firstName: strNULL(resultList.first_name),
            lastName: strNULL(resultList.last_name),
            dob: dateFormat(resultList.dob),
            gender: strNULL(resultList.gender),
            city: strNULL(resultList.city),
            resume: strNULL(resultList.resume),
            permit: permitForm,
            userRightMenu: userRightMenu,
            permission: permission,
            accessUser: table.tableAccessUser(users, accessUser),

            table: ''
         });
   }
   
   
   var tasks = [ getSection, initialization, accessValue, userMenu, tableAccess, listUser, listRender ];
   function noend(accessUser) {
      var currentTask = tasks.shift();
      if (currentTask) currentTask(accessUser);
   }
   noend();
};

///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


exports.submit = function (req, res, next) {

   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var permission = '00000';
   var users = null;
   var temp = '';
   var nameSection = '';
   var fnResult = [];
   var valid = false;

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

      if (req.body.admin.edit) {
         if (permission.indexOf('1', 2) == 2) {
            noend();
         } else {
            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }
      } else if (req.body.admin.drop) {
         if (permission.indexOf('1', 1) == 1) {
            noend();
         } else {
            res.error("У Вас нет прав на удаление!");
            res.redirect(pathname);
         }
      } else {
         res.redirect(pathname);
      }
   }
   
   function submitValidate() {
      if (req.body.admin.edit) {
         
         valid = validateAdmin(res, req.body.admin.email, req.body.admin.pass, req.body.admin.login, req.body.admin.first_name,
            req.body.admin.last_name, req.body.admin.dob, req.body.admin.gender, req.body.admin.city, req.body.admin.resume, req.body.admin.id_user);
         
         if (valid == true) {
            
            for (var key in req.body.admin) {
               if (req.body.admin[key].indexOf('нет данных') + 1) {
                  req.body.admin[key] = '';
               } else {
                  req.body.admin[key] = req.body.admin[key].trim();
               }
            }
            noend();
         }
      }

      if (req.body.admin.drop) {
         noend();
      }
   }
   
   function action3() {
      
      if (req.body.admin.edit) {
         
         var adminLogin = new Admin({
            email: req.session.uid
         });
         
         adminLogin.getUser(function (err, result) {
            if (err) return next(err);
            
            var resultLogin = result.login;
            
            if (resultLogin != req.body.admin.login) {
               
               Admin.getLogin(req.session.uid, req.body.admin.login, function (err, result) {
                  if (err) return next(err);
                  
                  if (result.rowCount == 1) {
                     res.error(req.body.admin.login + " - такой Login уже существует!");
                     res.redirect('back');
                     
                  } else {
                     noend();
                  }
               });
            } else {
               noend();
            }
         });
      }

      if (req.body.admin.drop) {
         noend();
      }
   }
   
   function action4() {
      
      if (req.body.admin.edit) {
         
         if (req.body.admin.email == req.session.uid) {
            
            var adminSave = new Admin({
               email: req.body.admin.email,
               pass: req.body.admin.pass,
               login: req.body.admin.login,
               first_name: req.body.admin.first_name,
               last_name: req.body.admin.last_name,
               dob: req.body.admin.dob,
               gender: req.body.admin.gender,
               city: req.body.admin.city,
               resume: req.body.admin.resume,
               id_user: req.body.admin.id_user
            });
            
            
            adminSave.save(function (err, result) {
               if (err) return next(err);
               
               fnResult.push(result.rowCount);
               
               if (fnResult.length == 2) {
                  
                  res.readyOk('Ваша учёная запись изменена успешно.');
                  res.redirect('back');
               }
            });
            
         } else {
            
            var getEmail = new Admin({
               email: req.body.admin.email
            });
            
            getEmail.getUser(function (err, result) {
               if (err) return next(err);
               
               if (result) {
                  res.error(req.body.admin.email + " - такая почта уже существует!");
                  res.redirect('back');
                  
               } else {
                  
                  var adminSave = new Admin({
                     email: req.body.admin.email,
                     pass: req.body.admin.pass,
                     login: req.body.admin.login,
                     first_name: req.body.admin.first_name,
                     last_name: req.body.admin.last_name,
                     dob: req.body.admin.dob,
                     gender: req.body.admin.gender,
                     city: req.body.admin.city,
                     resume: req.body.admin.resume,
                     id_user: req.body.admin.id_user
                  });
                  
                  
                  adminSave.save(function (err, result) {
                     if (err) return next(err);
                     
                     fnResult.push(result.rowCount);
                     
                     if (fnResult.length == 2) {
                        
                        res.redirect('/admin/logout');
                        
                     }
                  });
               }
            });
         }
      }
      
      if (req.body.admin.drop) {
         var id_user = req.body.admin.id_user;
         
         if (emptyStr(id_user).length == 0) {
            res.error("Скрытое поле \'id_user\' не может быть пустым!");
            res.redirect('back');
         } else if (id_user.length > 36) {
            res.error("Скрытое поле \'id_user\'  - должно быть не более 36 символов!");
            res.redirect('back');
         } else {
            var dropUser = new Admin({
               id_user: id_user
            });
            
            dropUser.drop(function (err, result) {
               if (err) return next(err);
               if (result.rowCount == 1) {
                  res.redirect('/admin/logout');
               }
            });
         }
      }
   }
   
   var tasks = [getSection, initialization, accessValue, submitAccess, submitValidate, action3, action4];
   
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   
   noend();
   
};


function strNULL(str) {
   if (str == null) {
      str = 'нет данных';
      return str;
   } else {
      return str;
   }
}

function emptyStr(str) {
   if (str == ' ') {
      str = '';
      return str;
   } else {
      return str;
   }
}

function validateAdmin(res, email, pass, login, first_name, last_name, dob, gender, city, resume, id_user) {
   
   if (emptyStr(email).length == 0) {
      res.error("Поле \'Ваш E-mail\' обязательно для заполнения!");
      res.redirect('back');
   } else if (emptyStr(login).length == 0 || login.trim() == 'нет данных') {
      res.error("Поле \'Ваш Login\' обязательно для заполнения!");
      res.redirect('back');
   } else if (email.length > 40) {
      res.error(email + ' - должно быть не боле 40 символов!');
      res.redirect('back');
   } else if (!(email.indexOf('.') > 0 && email.indexOf('@') > 0) || /[^a-zA-Z0-9.@_-]/.test(email)) {
      res.error(email + ' - электронный адрес имеет неверный формат!');
      res.redirect('back');
   } else if (login.length > 20) {
      res.error(login + ' - должно быть не более 20 символов!');
      res.redirect('back');
   } else if (pass.trim() == 'нет данных') {
      res.error("Поле \'Пароль\' обязательно для заполнения!");
      res.redirect('back');
   } else if (pass.length > 0 && emptyStr(pass).length == 0) {
      res.error("Поле \'Пароль\' не может быть пробелом!");
      res.redirect('back');
   } else if (pass.length > 12) {
      res.error(pass + ' - должно быть не более 12 символов!');
      res.redirect('back');
   } else if (emptyStr(first_name).length == 0) {
      res.error("Поле \'Ваше Имя\' не может быть пустым!");
      res.redirect('back');
   } else if (first_name.length > 30) {
      res.error(first_name + ' - должно быть не более 30 символов!');
      res.redirect('back');
   } else if (emptyStr(last_name).length == 0) {
      res.error("Поле \'Ваша Фамилия\' не может быть пустым!");
      res.redirect('back');
   } else if (last_name.length > 30) {
      res.error(last_name + ' - должно быть не более 30 символов!');
      res.redirect('back');
   } else if (emptyStr(dob).length == 0) {
      res.error("Поле \'Дата рождения\' не может быть пустым!");
      res.redirect('back');
   } else if (dob != 'нет данных' && !(/[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])/.test(dob))) {
      res.error(dob + ' - дата имеет неверный формат!');
      res.redirect('back');
   } else if (emptyStr(gender).length == 0) {
      res.error("Поле \'Пол\' не может быть пустым!");
      res.redirect('back');
   } else if (gender.length > 10) {
      res.error("Поле \'Пол\' - должно быть не более 10 символа!");
      res.redirect('back');
   } else if (emptyStr(city).length == 0) {
      res.error("Поле \'Ваш город\' не может быть пустым!");
      res.redirect('back');
   } else if (city.length > 100) {
      res.error(city + ' - должно быть не более 100 символов!');
      res.redirect('back');
   } else if (emptyStr(resume).length == 0) {
      res.error("Поле \'Resume\' не может быть пустым!");
      res.redirect('back');
   } else if (resume.length > 2000) {
      res.error(resume + ' - должно быть не более 2000 символов!');
      res.redirect('back');
   } else if (emptyStr(id_user).length == 0) {
      res.error("Скрытое поле \'id_user\' не может быть пустым!");
      res.redirect('back');
   } else if (id_user.length > 36) {
      res.error("Скрытое поле \'id_user\'  - должно быть не более 36 символов!");
      res.redirect('back');
   } else {
      return true;
   }
}

function dateFormat(ms) {
   var d = new Date(ms * 1);
   var options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
   };
   
   var date = d.toLocaleString("ru", options);
   
   if (date == '1970-01-01') {
      date = 'нет данных';
      return date;
      
   } else {
      return date;
   }
}