var Catalog = require('./model/index');
var table = require('../../../lib/tableList');
var menu = require('../../../lib/menu');
var Permit = require('../../../lib/permit');
var url = require('url');


exports.list = function (req, res, next) {

   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var temp = '';
   var nameSection = '';
   var resultList = '';
   var formValue = '';
   var permission = '00000';
   var users = null;
   var action = '';
   var userRightMenu = '';
   var permitForm = '';
   var section = '';
   var sectionOld = null;
   var selectOnePage = '';
   var id_one_page = '';
   var titlePage = '';

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
   
   function listAccess() {
      
      if (urlParsed.query.edit) {
         
         if (permission.indexOf('1', 2) == 2) {
            
            noend();
         
         } else {
            
            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }
      
      } else if(urlParsed.query.drop){
         
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
   
   function sectionForm(){
   
      if(permission.indexOf('1', 0) != 0 && !urlParsed.query.section){
         res.redirect('/admin');
      } else {
   
         sectionSelect(urlParsed.query.section, users, req.session.uid, temp, function (err, select) {
            if (err) return next(err);
            section = select;
            noend();
         });
            
      }
   }

   function getOnePage() {

      var name = '';

      var page_one = new Catalog(
         {
            template: temp,
            section: urlParsed.query.section,
            users: users,
            author: req.session.uid
         }
      );

      page_one.getOnePage(function (err, result) {
         if (err) return next(err);

         if(result.rowCount > 0){

            var onePage = result.rows[0].one_page;

            id_one_page = result.rows[0].id_one_page;

            name = result.rows[0].name;

            titlePage += 'Раздел: ' + result.rows[0].section_name + '. ';


            if(onePage == 1){

               page_one.selectRecord(function (err, recordResult) {

                  if (err) return next(err);

                  if(recordResult.rowCount > 0) {

                     selectOnePage = onePageSelect(id_one_page, recordResult.rows);
                  }

               });

               titlePage +='Шаблон: '+ name +'(одна страница).';

            } else {

               titlePage +='Шаблон: '+ name +'(много страниц).';
            }

            noend();

         } else {

            page_one.getNameSectionPermit(function (err, result) {
               if (err) return next(err);

               name = result.rows[0].name;

               titlePage +='Шаблон: '+ name +'(много страниц).';

               noend();

            });
         }
      });
   }

   function listEdit() {

      if (urlParsed.query.edit) {
         action = 'edit';

      var edit = new Catalog(
         {
            id: urlParsed.query.edit, 
            author_edit: req.session.uid
         }
      );

         if (users == 1) {
   
            edit.editIdEmail(function (err, result) {
               if (err) return next(err);
   
               if (result.rowCount == 1) {

                  formValue = result.rows[0];
                  noend();

               } else {
   
                  res.error("Такой записи не существует!");
                  res.redirect(pathname);
               }
            });
   
         } else {
   
            edit.editId(function (err, result) {
               if (err) return next(err);
   
               if (result.rowCount == 1) {
   
                  formValue = result.rows[0];
                  noend();

               } else {

                  res.error("Такой записи не существует!");
                  res.redirect(pathname);
               }
            });
         }
         
      } else {
         noend();
      }

   }
   
   function listDrop() {

      if (urlParsed.query.drop) {

         action = 'drop';

         var drop = new Catalog(
            {
               id: urlParsed.query.drop,
               author_edit: req.session.uid
            }
         );

         if (users == 1) {

            drop.editIdEmail(function (err, result) {
               if (err) return next(err);

               if (result.rowCount == 1) {

                  formValue = result.rows[0];
                  noend();
               } else {
                  res.error("Такой записи не существует!");
                  res.redirect(pathname);
               }
            });

         } else {

            drop.editId(function (err, result) {
               if (err) return next(err);

               if (result.rowCount == 1) {

                  formValue = result.rows[0];
                  noend();
               }
            });
         }

      } else {

         noend();
      }
   }
   
   
   function listRender() {
   
      if(urlParsed.query.section){
         sectionOld = urlParsed.query.section;
      } else {
         sectionOld = 0;
      }
      
      
      var catalogList = new Catalog({
         template: temp,
         users: users,
         section: urlParsed.query.section,
         email: req.session.uid
      });


      catalogList.list(function (err, result) {
         if (err) return next(err);
   
         resultList = result;
   
         var urlPage = urlParsed.query.page;
         var limit = 8;
         var linkLimit = 5;
         var offset = urlPage * limit - limit;
   
         if( offset < 0 || !offset) offset = 0;
   
         catalogList.listLimit(limit, offset, function (err, result) {
            if (err) return next(err);
   
            var resultLimit = result;
   
            if (permission.indexOf('1', 4) == 4) {
               resultList = table.tableListCatalog(req, id_one_page, resultList, urlParsed, permission, limit, linkLimit, urlPage, resultLimit);
            }
   
            res.render('template/catalog',
               {
                  urlPage: req.url,
                  title: titlePage,
                  formValue: formValue,
                  permit: permitForm,
                  action: action,
                  permission: permission,
                  userRightMenu: userRightMenu,
                  template: temp,
                  section: section,
                  renew: '<a class="renew_btn" href="' + urlParsed.pathname + '?section='+ sectionOld +'">Обновить страницу</a>',
                  selectOnePage: selectOnePage,
         
                  table: resultList
               }
            );
         });
      });
   }
   
   var tasks = [getSection, initialization, accessValue, userMenu, listAccess, sectionForm, getOnePage, listEdit, listDrop, listRender];

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
   var val = '';
   var section = null;
   var sectionOld = null;

   function getSection() {

      Permit.getSection( pathname, function (err, result) {
         if (err) return next(err);

         if(result.rowCount == 1){

            temp = result.rows[0].temp;
            nameSection = result.rows[0].name;
            val = req.body[temp];

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

      if (val.create) {
         if (permission.indexOf('1', 3) == 3) {
            noend();
         } else {
            res.error("У Вас нет прав на сохранение!");
            res.redirect(pathname);
         }
      } else if (val.edit) {
         if (permission.indexOf('1', 2) == 2) {
            noend();
         } else {
            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }
      } else if (val.drop) {
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

      if (permission.indexOf('1', 0) != 0) {
         val.status = 0;
         val.main = 0;
      }

      if (val.title == ' ' || val.description == ' ' || val.content == ' '|| val.price == ' ' || val.priority == ' ' || val.alias == ' ') {
         res.error("Полe не может быть пробелом!");
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.title.length < 1) {
         res.error("Поля отмеченные звёздочкой обязательны для заполнения!");
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.title.length > 120) {
         res.error(val.title + ' - должно быть не более 120 символов!');
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.alias.length > 120) {
         res.error(val.alias + ' - должно быть не более 120 символов!');
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.description.length > 1000) {
         res.error(val.description + ' - должно быть не более 1000 символов!');
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.content.length > 10000) {
         res.error(val.content + ' - должно быть не более 10000 символов!');
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.price.length > 8) {
         res.error(val.price + ' - должно быть не более 8 символов!');
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.priority.length > 10) {
         res.error(val.priority + ' - должно быть не более 10 символов!');
         res.repeatData(
            {
               title: val.title,
               alias: val.alias,
               description: val.description,
               content: val.content,
               price: val.price,
               priority: val.priority
            });
         res.redirect('back');
      } else if (val.status.length > 1) {
         res.error(val.status + ' - должно быть не более 1 символа!');
         res.redirect('back');
      } else if (val.main.length > 2) {
         res.error(val.main + ' - должно быть не более 1 символа!');
         res.redirect('back');
      } else {

         noend();
      }
   }
   
   function alias() {
      
      if (val.latin == 1) {
         
         if (val.alias.length < 1) {
            
            val.alias = translite(val.title.trim()).toLowerCase();
            
            noend();
            
         } else {
            
            val.alias = translite(val.alias.trim()).toLowerCase();
            
            noend();
            
         }
         
      } else {
         
         if (val.alias.length < 1) {
            
            res.error('Если поле "Псевдоним" отмечено как "original", то поле обязательно для заполнения!');
            res.repeatData(
               {
                  title: val.title.trim(),
                  alias: val.alias.trim(),
                  description: val.description.trim(),
                  content: val.content.trim(),
                  price: val.price.trim(),
                  priority: val.priority.trim()
               });
            res.redirect('back');
            
         } else {
            noend();
         }
      }
   }

   function submitSection() {


      if(urlParsed.query.section){
         sectionOld = urlParsed.query.section;
      } else {
         sectionOld = 0;
      }


      if(val.section) {

         if (val.section.length > 36) {
            res.error(val.section + ' - должно быть не более 36 символов!');
            res.repeatData(
               {
                  title: val.title,
                  alias: val.alias,
                  description: val.description,
                  content: val.content,
                  price: val.price,
                  priority: val.priority
               });
            res.redirect('back');

         } else if (val.section != 0) {

            section = val.section;
            noend();
         
         } else if (val.section == 0){
            
            section = 0;
            noend();
         }

      } else if (urlParsed.query.section) {

         section = urlParsed.query.section;
         noend();

      } else {

         noend();
      }
   }

   function submitOnePage() {

      if(val.one_page){

         var updateOnePage = new Catalog(
            {
               id_one_page: val.one_page,
               template_name: temp,
               section_id: section
            }
         );

         updateOnePage.updateOnePage(function (err, result) {
            if (err) return next(err);
            noend();
         });

      } else {
         noend();
      }
   }

   function submitCreate() {

      if (val.create) {

         var create = new Catalog({

            title: val.title.trim(),
            alias: val.alias.trim(),
            section: section,
            description: val.description.trim(),
            content: val.content.trim(),
            price: val.price.trim(),
            priority: val.priority.trim(),
            date_create: Date.now(),
            author: req.session.uid,
            template: temp,
            status: val.status,
            main: val.main

         });

         create.isset(function (err, result) {
            if (err) return next(err);

            if (result == 0) {

               res.error("Псевдоним не уникален!");
               res.repeatData(
                  {
                     title: val.title.trim(),
                     alias: val.alias.trim(),
                     description: val.description.trim(),
                     content: val.content.trim(),
                     price: val.price.trim(),
                     priority: val.priority.trim()
                  });
               res.redirect('back');

            } else {

               create.save(function (err, result) {
                  if (err) return next(err);

                  setTimeout(function () {

                     if (result.rowCount == 1 && permission.indexOf('1', 0) != 0) {

                        res.readyOk('Статья будет опубликована после проверки модератором.');
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                     } else if (result.rowCount == 1) {

                        res.readyOk('Запись сохранена.');
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                     } else {

                        res.error("Запись не сохранена!");
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                     }

                  }, 50);

               });
            }
         });

      } else {
         noend();
      }
   }

   function submitEdit() {

      if (val.edit) {

         var edit = new Catalog({

            id: urlParsed.query.edit,
            title: val.title.trim(),
            alias: val.alias.trim(),
            section: section,
            description: val.description.trim(),
            content: val.content.trim(),
            price: val.price.trim(),
            priority: val.priority.trim(),
            date_edit: Date.now(),
            author_edit: req.session.uid,
            template: temp,
            main: val.main,
            status: val.status

         });

         edit.isset(function (err, result) {
            if (err) return next(err);

            if (result == 0) {

               res.error("Псевдоним не уникален!");
               res.repeatData(
                  {
                     title: val.title.trim(),
                     alias: val.alias.trim(),
                     description: val.description.trim(),
                     content: val.content.trim(),
                     price: val.price.trim(),
                     priority: val.priority.trim()
                  });
               res.redirect('back');

            } else {

               if (users == 1) {

                  edit.editIdEmail(function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount == 1) {

                        edit.edit(function (err, result) {
                           if (err) return next(err);

                           setTimeout(function () {

                              if (result.rowCount == 1 && permission.indexOf('1', 0) != 0) {
                                 res.readyOk('Статья будет опубликована после проверки модератором.');
                                 res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                              } else if (result.rowCount == 1) {

                                 res.readyOk('Запись изменена.');
                                 res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                              } else {

                                 res.error("Запись не изменена!");
                                 res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                              }
                           }, 50);

                        });

                     } else {
                        res.error("Запись не изменена!");
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                     }
                  });

               } else {

                  edit.editId(function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount == 1) {

                        edit.edit(function (err, result) {
                           if (err) return next(err);

                           setTimeout(function () {

                              if (result.rowCount == 1) {

                                 res.readyOk('Запись изменена.');
                                 res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                              } else {

                                 res.error("Запись не изменена!");
                                 res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                              }
                           }, 50);

                        });

                     } else {

                        res.error("Такой записи не существует!");
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                     }
                  });
               }
            }
         });

      } else {

         noend();
      }
   }

   function submitDrop() {

      var drop = new Catalog({
         id: urlParsed.query.drop,
         author_edit: req.session.uid
      });

      if (users == 1) {

         drop.editIdEmail(function (err, result) {
            if (err) return next(err);

            if (result.rowCount == 1) {

               drop.drop(function (err, result) {
                  if (err) return next(err);

                  setTimeout(function () {
                     if(result.rowCount == 1){

                        res.readyOk('Запись удалена');
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                     } else {

                        res.error('Запись не удалена!');
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                     }
                  }, 50);

               });

            } else {

               res.error("Такой записи не существует!");
               res.redirect( urlParsed.pathname + '?section=' + sectionOld );
            }
         });

      } else {
   
         drop.editId(function (err, result) {
            if (err) return next(err);
   
            if (result.rowCount == 1) {
               
               drop.drop(function (err, result) {
                  if (err) return next(err);

                  setTimeout(function () {
                     if (result.rowCount == 1) {

                        res.readyOk('Запись удалена');
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );

                     } else {

                        res.error('Запись не удалена!');
                        res.redirect( urlParsed.pathname + '?section=' + sectionOld );
                     }
                  }, 50);
               });
            
            } else {
               
               res.error("Такой записи не существует!");
               res.redirect( urlParsed.pathname + '?section=' + sectionOld );
            }
         });
      }
   }
   

   var tasks = [getSection, initialization, accessValue, submitAccess, submitValidate, alias, submitSection, submitOnePage, submitCreate, submitEdit, submitDrop];

   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }

   noend();

};

function translite(str) {

   var arr = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'g',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'ы': 'i', 'э': 'e',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'G', 'З': 'Z',
      'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
      'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Ы': 'I', 'Э': 'E', 'ё': 'yo',
      'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ь': '', 'ю': 'yu',
      'я': 'ya', 'Ё': 'YO', 'Х': 'H', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': '',
      'Ь': '', 'Ю': 'YU', 'Я': 'YA', ' ': '-', ';': '', ':': '',  '?': '',   "'": '', '"': '',
      '}': '', '{': '', ']': '', '[': '', '+': '', '_': '', '*': '', '&': '', '%': '',
      '^': '', '$': '', '#': '', '@': '', '!': '', '~': '', ')': '', '(': '', '|': '', '\\': '',
      '/': '', '.': '', ',': '', '<': '', '>': '', '«':'', '»':''
   };

   str = str.split('');


   var strstr = '';

   for(var i=0; i < str.length; i++){

      if(arr[str[i]]){

         strstr += arr[str[i]];

      } else {

         if(arr[str[i]] == ''){
            strstr += arr[str[i]];
         } else {
            strstr += str[i];
         }
      }
   }

   if( strstr.indexOf('-', strstr.length - 1 ) == strstr.length - 1 ){
      strstr = strstr.substring(0, strstr.length - 1);
   }

   return strstr;

}

function sectionSelect(section_id, users, email, temp, fn) {
   
   var str = '';
   
   function action1() {
      
      var select = new Catalog({
         temp: temp,
         users: users,
         author: email
      });
      
      select.selectSection(function (err, result) {
         if (err) return fn(err);
         
         if(result.rowCount > 0){
            
            var sections = result.rows;
            
            str += '<p><label class="label">Выбрать раздел: </label>' + '\n';
            
            str += '<select name="'+ temp + '[section]">' + '\n';
            str += '<option value="0">Не выбран раздел</option>' + '\n';
            
            for(var i = 0; i < sections.length; i++){
               
               str += '<option value="' + sections[i].section_id + '" ';
               
               if(sections[i].section_id == section_id){
                  str += 'selected';
               }
               
               str += ' >' + sections[i].section + '</option>' + '\n';
               
            }
            str += '</select>' + '\n';
            str += '</p>' + '\n';
            
            noend()
            
         } else {
            
            str += '<p><label class="label">Выбрать раздел: </label>' + '\n';
            str += '<select name="'+ temp + '[section]">' + '\n';
            str += '<option value="0">Нет разделов в шаблоне</option>' + '\n';
            str += '</select>' + '\n';
            str += '</p>' + '\n';
            noend()
         }
         
      });
   }
   
   function action2() {
      
      return fn(null, str);
      
   }
   
   
   var tasks = [action1, action2];
   
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   
   noend();
   
}

function onePageSelect(id, record) {

   var str = '';

   str += '<p><label class="label">Выбрать запись: </label>' + '\n';

   str += '<select name="'+ record[0].template + '[one_page]">' + '\n';
   str += '<option value="0">Не выбрана запись</option>' + '\n';

   for(var i = 0; i < record.length; i++){

      str += '<option value="' + record[i].id + '" ';

      if(record[i].id == id){
         str += 'selected';
      }

      str += ' >' + '['+record[i].id +'] '+ record[i].title + '</option>' + '\n';

   }
   str += '</select>' + '\n';
   str += '</p>' + '\n';

   return str;

}