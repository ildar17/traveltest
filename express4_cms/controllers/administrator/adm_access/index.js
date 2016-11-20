var url = require('url');
var conf = require('../../../config');
var Administrator = require('./model/index');
var table = require('../../../lib/tableList');
var menu = require('../../../lib/menu');
var Permit = require('../../../lib/permit');
var valid = null;

exports.list = function (req, res, next) {
   res.locals.urlPage = req.url;
   var trigger = '';
   
   function action1() {

      if (conf.get('administrator') != req.session.uid) {
         res.redirect('/admin');
      } else {
         noend();
      }
   }

   function userMenu() {

      menu.adminRightMenu(null, req.session.uid, function (err, result) {
         if (err) return next(err);

         var userRightMenu = result;

         noend(userRightMenu);
      });
   }

   function action2(userRightMenu) {

      var urlParsed = url.parse(req.url, true);

      if (urlParsed.query.dropRole) {
         var dropRole = urlParsed.query.dropRole;

         var adm = new Administrator({
            dropRole: dropRole
         });

         adm.deleteRole(function (err, result) {
            if (err) return next(err);
            if (result.rowCount == 1) {
               res.readyOk('Роль удалена');
               res.redirect('/admin/administrator/adm_access');
            }
         });

      } else if (urlParsed.query.editRole) {

         var editRole = urlParsed.query.editRole;

         var adm = new Administrator({editRole: editRole});

         adm.getOneRole(function (err, result) {
            if (err) return next(err);

            if (result.rowCount == 1) {
               var nameRole = result.rows[0].name_role;
               var users = result.rows[0].users;
               var oneRole = [];
               oneRole.push(nameRole);
               oneRole.push(users);
               noend(oneRole, userRightMenu);
            }
         });

      } else if (urlParsed.query.dropRolePage) {

         Administrator.dropRolePage(urlParsed.query.dropRolePage, function (err, result) {
            if (err) return next(err);
            if (result.rowCount == 1) {
               res.readyOk('Регистрация страницы снята.');
               res.redirect('/admin/administrator/adm_access');
            }
         })

      } else if (urlParsed.query.tuneRole) {

         trigger = urlParsed.query.tuneRole;
         var id_role = urlParsed.query.tuneRole;
         var nameRole = '';

         Permit.getOneRole(id_role, function (err, result) {
            if (err) return next(err);
            if (result.rowCount == 1) {
               nameRole = result.rows[0].name_role;
            } else if (result.rowCount == 0) {
               res.error('Нет такой роли!');
               res.redirect('/admin/administrator/adm_access');
            }

            Permit.getPermit(function (err, result) {
               if (err) return next(err);

               if (result.rowCount > 0) {

                  var tableTuneRole = '';

                  table.tableTuneRole(result, id_role, function (err, result) {
                     if (err) return next(err);

                     tableTuneRole = result;

                     res.render('administrator/adm_access', {
                        title: "Роль:" + ' "' + nameRole + '"',
                        triggerAccess: trigger,
                        triggerUsers: '',
                        triggerName: '',
                        tableTuneRole: tableTuneRole,
                        userRightMenu: userRightMenu,

                        permit: '',
                        table: ''
                     });

                  });

               } else if (result.rowCount == 0) {
                  res.error('Нет регистрации страниц с правами доступа.');
                  res.redirect('/admin/administrator/adm_access');
               }
            });

         });

      } else if (urlParsed.query.assignRole) {

         trigger = urlParsed.query.assignRole;
         var id_user = urlParsed.query.assignRole;

         Administrator.getOneUser(id_user, function (err, result) {
            if (err) return next(err);
            
            Administrator.getAllRoleModerator(function (err, allRoleModerator) {
               if (err) return next(err);
               
               Administrator.getRoleUsers(function (err, oneRoleUsers) {
                  
                  res.render('administrator/adm_access', {
                     title: "Присвоить роль модератора пользователю: " + result.rows[0].login + '(' + result.rows[0].email + ')',
                     triggerUsers: trigger,
                     triggerAccess: '',
                     triggerName: '',
                     tableOneUser: table.tableOneUsers(result, allRoleModerator, oneRoleUsers),
                     userRightMenu: userRightMenu,

                     permit: '',
                     table: ''
                  });
               });
            });
         });
      
      } else if (urlParsed.query.addName) {
         
         trigger = urlParsed.query.addName;
   
         var id_permit = urlParsed.query.addName;

         var adm = new Administrator({
            id_permit: id_permit
         });


         adm.getOnePermit(function (err, result) {
            if (err) return next(err);
            res.render('administrator/adm_access', {
               title: "Адрес шаблона: domen" + result.url_temp,
               triggerUsers: '',
               triggerAccess: '',
               triggerName: trigger,
               formNamePermit: result,
               userRightMenu: userRightMenu,


               permit: '',
               table: ''
            });
         });
      
      } else {

         noend('', userRightMenu);
      }
   }

   function action3(oneRole, userRightMenu) {

      var adm = new Administrator({});

      adm.getRole(function (err, result) {
         if (err) return next(err);
         var tableRole = result;

         adm.getRoleUrl(function (err, result) {
            if (err) return next(err);
            var tableRoleUrl = result;

            Administrator.getUsers(function (err, result) {
               if (err) return next(err);
               var tableUsers = result;
               
               Administrator.getRoleUsers(function (err, result) {
                  if (err) return next(err);
                  var roleUsers = result;
                  
                  Administrator.getPermit(function (err, result) {
                     if (err) return next(err);
                     var tableAccess = result;
                     noend(tableRole, tableRoleUrl, tableUsers, oneRole, roleUsers, tableAccess, userRightMenu);
                  });
               });
            });
         });
      });

   }

   function action4(tableRole, tableRoleUrl, tableUsers, oneRole, roleUsers, tableAccess, userRightMenu) {

      if (oneRole) {
         var nameRole = oneRole[0];
         var users = oneRole[1]
      } else {
         var nameRole = '';
         var users = '';
      }
      
      res.render('administrator/adm_access', {
         title: "Администрирование сайта",
         triggerAccess: trigger,
         triggerUsers: trigger,
         triggerName: trigger,
         nameRole: nameRole,
         users: users,
         tableRole: table.tableListRole(tableRole),
         tableRoleUrl: table.tableListRoleUrl(tableRoleUrl),
         tableUsers: table.tableUsers(tableUsers, roleUsers),
         tableAccess: table.tableAccess(tableAccess),
         userRightMenu: userRightMenu,


         permit: '',
         table: ''
      });
   }
   
   
   var tasks = [action1, userMenu, action2, action3, action4];

   function noend(tableRole, tableRoleUrl, tableUsers, oneRole, roleUsers, tableAccess, userRightMenu) {
      var currentTask = tasks.shift();
      if (currentTask) currentTask(tableRole, tableRoleUrl, tableUsers, oneRole, roleUsers, tableAccess, userRightMenu);
   }

   noend();

};

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

exports.submit = function (req, res, next) {
   res.locals.urlPage = req.url;

   
   function action1() {
      if (conf.get('administrator') != req.session.uid) {
         res.redirect('/');
      } else {
         noend();
      }
   }

   function action2() {

      var urlParsed = url.parse(req.url, true);

      if (req.body.administrator.createRole) {

         valid = validateRole(res, req.body.administrator.nameRole, req.body.administrator.users);

         var nameRole = req.body.administrator.nameRole.trim();
         var users = req.body.administrator.users;
         
         if (valid == true) {
            var adm = new Administrator({
               nameRole: nameRole,
               users: users
            });
            
            adm.saveRole(function (err, result) {
               if (err) return next(err);
               if (result.rowCount == 1) {
                  res.readyOk('Роль добавлена.');
                  res.redirect('back');
               }
            })
         }
      }

      if (req.body.administrator.editRole) {

         valid = validateRole(res, req.body.administrator.nameRole, req.body.administrator.users);

         var nameRole = req.body.administrator.nameRole.trim();
         var users = req.body.administrator.users;

         if (valid == true) {

            var urlParsed = url.parse(req.url, true);

            var adm = new Administrator({
               id_role: urlParsed.query.editRole,
               nameRole: nameRole,
               users: users
            });

            adm.editRole(function (err, result) {
               if (err) return next(err);

               if (result.rowCount == 1) {
                  res.readyOk('Роль изменена.');
                  res.redirect('back');
               }
            });
         }
      }

      if (req.body.administrator.createTuneRole) {

         var objRole = req.body.administrator;
         var id_role = req.body.administrator.id_role;

         var arrResult = [];
         
         var lenObj = 0;

         for (var keys in objRole) {
            lenObj++;
         }

         lenObj = lenObj - 3;

         addEmptyAccess(objRole, id_role, function (err, result) {
            if (err) return next(err);

            arrResult.push(result);

            if (arrResult.length == lenObj) {

               addAccess(objRole, id_role, function (err, result) {
                  if (err) return next(err);

               });
            }
         });

         setTimeout(function () {
            res.readyOk('Настройки изменены.');
            res.redirect('back');
         }, 100);

      }

      if (req.body.administrator.assignRole) {

         var adm = new Administrator({
            id_user: req.body.administrator.id_user,
            role_id: req.body.administrator.selectRole,
            usersRoleId: req.body.administrator.usersRoleId
         });
         
         adm.assignRole(function (err, result) {
            if (err) return next(err);
            
            if (result.rowCount == 1) {
               res.readyOk('Роль присвоена.');
               res.redirect('back');
            }
         })

      }

      if(req.body.administrator.addName){

         var id_permit = urlParsed.query.addName;

         var adm = new Administrator({
            id_permit: id_permit,
            name: req.body.administrator.name,
            priority: req.body.administrator.priority
         });

         adm.addNamePermit(function (err, result) {
            if (err) return next(err);

            if(result.rowCount == 1){
               res.redirect('/admin/administrator/adm_access');
            }
         })
      }
   }
   
   var tasks = [action1, action2];

   function noend(result) {
      var currentTask = tasks.shift();
      if (currentTask) currentTask(result);
   }

   noend();
};


function validateRole(res, nameRole, users) {

   if (nameRole.length > 60) {
      res.error(nameRole + ' - должно быть не более 60 символов!');
      res.redirect('back');
   } else if (users.length > 1) {
      res.error(nameRole + ' - должно быть не более 1 символа!');
      res.redirect('back');
   } else if (nameRole == ' ' || nameRole == '') {
      res.error("Поле \'Название роли\' не может быть пустым");
      res.redirect('back');
   } else if (users == ' ') {
      res.error("Поле \'users\' не может быть пробелом");
      res.redirect('back');
   } else {
      return true;
   }
}


function addEmptyAccess(objRole, id_role, fn) {
   
   var arr = objRole.check.split(',');
   
   var k = arr.length, value = [];
   
   arr.sort(function (a, b) {
      return b - a;
   });
   
   while (k--) {
      
      if (value.join().search(arr[k] + '\\b') == '-1') {
         value.push(arr[k]);
      }
   }
   
   for (var j = 0; j < value.length; j++) {
      
      Permit.setAccess(id_role, value[j], '00000', function (err, result) {

         if (err) {
            return fn(err, null)
         } else {
            return fn(null, result)
         }
      });
   }
}

function addAccess(objRole, id_role, fn) {
   
   for (var key in objRole) {
      
      if (key != 'createTuneRole' && key != 'id_role' && key != 'check') {
         
         if ((Object.prototype.toString.call(objRole[key]) == '[object Array]')) {
            
            var sum = 0;
            var count = objRole[key].length;
            
            for (var i = 0; i < count; i++) {
               
               sum += objRole[key][i] * 1;
               
               if (i == (count - 1)) {
                  
                  var len = sum.toString().length;
                  if (len == 1) sum = '0000' + sum.toString();
                  if (len == 2) sum = '000' + sum.toString();
                  if (len == 3) sum = '00' + sum.toString();
                  if (len == 4) sum = '0' + sum.toString();
                  if (len == 5) sum = sum.toString();
                  
                  Permit.setAccess(id_role, key, sum, function (err, result) {
                     if (err) {
                        return fn(err, null)
                     } else {
                        return fn(null, result)
                     }
                  });
               }
            }
            
         } else {
            
            var len = objRole[key].toString().length;
            if (len == 1) sum = '0000' + objRole[key].toString();
            if (len == 2) sum = '000' + objRole[key].toString();
            if (len == 3) sum = '00' + objRole[key].toString();
            if (len == 4) sum = '0' + objRole[key].toString();
            if (len == 5) sum = objRole[key].toString();
            
            Permit.setAccess(id_role, key, sum, function (err, result) {
               if (err) {
                  return fn(err, null)
               } else {
                  return fn(null, result)
               }
            });
         }
      }
   }
}
