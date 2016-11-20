var Layer = require('./model/index');
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
   var trigger = '';
   
   function getSection() {
      
      Permit.getSection(pathname, function (err, result) {
         if (err) return next(err);
         
         if (result.rowCount == 1) {
            
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
               
               if (result.command == 'SELECT') {
                  
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
   
   function getAccess() {
      
      if (urlParsed.query.edit) {
         
         if (permission.indexOf('1', 2) == 2) {
            
            noend();
            
         } else {
            
            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }
         
      } else if (urlParsed.query.drop) {
         
         if (permission.indexOf('1', 1) == 1) {
            
            noend();
            
         } else {
            
            res.error("У Вас нет прав на удаление!");
            res.redirect(pathname);
         }

      } else if (urlParsed.query.dropStr) {

         if (permission.indexOf('1', 1) == 1) {

            noend();

         } else {

            res.error("У Вас нет прав на удаление!");
            res.redirect(pathname);
         }

      } else if (urlParsed.query.createBlocks) {

         if (permission.indexOf('1', 3) == 3) {

            noend();

         } else {

            res.error("У Вас нет прав на создание набора блоков!");
            res.redirect(pathname);
         }

      } else {
         
         noend();
      }
   }
   
   function createBlocks(){

      if (urlParsed.query.dropBlock) {

         if (permission.indexOf('1', 1) == 1) {

            var dropBlock = new Layer({layer_id: urlParsed.query.createBlocks.trim(), block_id: urlParsed.query.dropBlock.trim()});

            dropBlock.dropBlock(function (err, result) {
               if (err) return next(err);

               if(result.rowCount == 1){

                  res.readyOk('Запись удалена.');
                  res.redirect('/admin/template/layer?createBlocks=' + urlParsed.query.createBlocks);

               } else {

                  res.error("Запись не удалена!");
                  res.redirect('/admin/template/layer?createBlocks=' + urlParsed.query.createBlocks);
               }

            });


         } else {

            res.error("У Вас нет прав на удаление набора блоков!");
            res.redirect(pathname);
         }

      } else if (urlParsed.query.createBlocks){
         
         trigger = urlParsed.query.createBlocks;

         var blocks = new Layer(
            {
               id: urlParsed.query.createBlocks,
               author: req.session.uid
            }
         );

         if(users == 1){

            blocks.getIdEmail(function (err, result) {
               if (err) return next(err);

               blocks.getBlocksIdEmail(function (err, resultBlocks) {
                  if (err) return next(err);
   
                  blocks.getTableId(function (err, resultTable) {
                     if (err) return next(err);
   
                     res.render('template/layer', {
                        urlPage: req.url,
                        title: nameSection,
                        permit: permitForm,
                        permission: permission,
                        userRightMenu: userRightMenu,
                        template: temp,
                        triggerBlocks: trigger,
                        layerTitle: result.rows[0].title,
                        layerAlias: result.rows[0].alias,
                        blocks: blocksSelect(resultBlocks.rows),
                        layer: table.tableLayerAndBlock(resultTable, permission, urlParsed.query.createBlocks),

                        table: ''
                     });
                  });
               });
            });

         } else {

            blocks.getId(function (err, result) {
               if (err) return next(err);

               blocks.getBlocksId(function (err, resultBlocks) {
                  if (err) return next(err);
                  
                  blocks.getTableId(function (err, resultTable) {
                     if (err) return next(err);
                     
                     res.render('template/layer', {
                        urlPage: req.url,
                        title: nameSection + ', имя набора: ' + result.rows[0].title + ', псевдоним набора: ' + result.rows[0].alias + ', владелец: ' + result.rows[0].author,
                        permit: permitForm,
                        permission: permission,
                        userRightMenu: userRightMenu,
                        template: temp,
                        triggerBlocks: trigger,
                        layerTitle: result.rows[0].title,
                        layerAlias: result.rows[0].alias,
                        blocks: blocksSelect(resultBlocks.rows),
                        layer: table.tableLayerAndBlock(resultTable, permission, urlParsed.query.createBlocks),

                        table: ''
                     });
                  });
               });
            });
         }

      } else {

         noend();
      }
   }

   function listEdit() {

      if (urlParsed.query.edit) {
         action = 'edit';

         var edit = new Layer(
            {
               id: urlParsed.query.edit,
               author: req.session.uid
            }
         );

         if (users == 1) {

            edit.getIdEmail(function (err, result) {

               if (err) return next(err);

               if (result.rowCount == 1) {

                  formValue = result.rows[0];
                  noend(formValue);

               } else {

                  res.error("Такой записи не существует!");
                  res.redirect(pathname);
               }
            });

         } else {

            edit.getId(function (err, result) {
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

   function listDrop() {


      if (urlParsed.query.drop) {
         action = 'drop';

         var drop = new Layer(
            {
               id: urlParsed.query.drop,
               author: req.session.uid
            }
         );

         if (users == 1) {

            drop.getIdEmail(function (err, result) {

               if (err) return next(err);

               if (result.rowCount == 1) {

                  formValue = result.rows[0];
                  noend(formValue);

               } else {

                  res.error("Такой записи не существует!");
                  res.redirect(pathname);
               }
            });

         } else {

            drop.getId(function (err, result) {
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

   function dropStr() {

      if(urlParsed.query.dropStr){

         var get_str = new Layer({
            id: urlParsed.query.dropStr,
            author: req.session.uid
         });

         get_str.getStrLayer(function (err, result) {
            if (err) return next(err);

            if(result.rowCount > 0){

               var get_all_str = new Layer({
                  layer_id: result.rows[0].layer_id,
                  author: req.session.uid
               });

               get_all_str.getAllStrLayer(function (err, resultAll) {
                  if (err) return next(err);

                  if(resultAll.rowCount > 1){

                     get_str.deleteStrLayer(function(err, result){
                        if (err) return next(err);

                        res.redirect(pathname);

                     });

                  } else {
                     res.redirect(pathname);
                  }
               })

            } else {
               res.redirect(pathname);
            }
         });

      } else {
         noend();
      }
   }
   
   
   function listRender() {

      var layerList = new Layer({
         template: temp,
         users: users,
         email: req.session.uid
      });


      layerList.list(function (err, result) {
         if (err) return next(err);


         if (permission.indexOf('1', 4) == 4) {
            resultList = table.tableListLayer(result, permission);
         }

         res.render('template/layer',
            {
               urlPage: req.url,
               title: nameSection,
               formValue: formValue,
               permit: permitForm,
               action: action,
               permission: permission,
               userRightMenu: userRightMenu,
               template: temp,
               triggerBlocks: trigger,
               layer: resultList,

               table: ''
            }
         );
      });
   }
   
   var tasks = [getSection, initialization, accessValue, userMenu, getAccess, createBlocks, listEdit, listDrop, dropStr, listRender];
   
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   
   noend();
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

exports.submit = function (req, res, next) {
   
   res.locals.urlPage = req.url;
   var urlParsed = url.parse(req.url, true);
   var pathname = urlParsed.pathname;
   var permission = '00000';
   var users = null;
   var temp = '';
   var nameSection = '';
   var value = null;
   
   function getSection() {
      
      Permit.getSection(pathname, function (err, result) {
         if (err) return next(err);
         
         if (result.rowCount == 1) {
            
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
   
   function postAccess() {

      if (value.create) {
         if (permission.indexOf('1', 3) == 3) {
            noend();
         } else {
            res.error("У Вас нет прав на сохранение!");
            res.redirect(pathname);
         }
      } else if (value.edit) {
         if (permission.indexOf('1', 2) == 2) {
            noend();
         } else {
            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }
      } else if (value.drop) {
         if (permission.indexOf('1', 1) == 1) {
            noend();
         } else {
            res.error("У Вас нет прав на удаление!");
            res.redirect(pathname);
         }

      } else if (value.createBlocks) {

         if (permission.indexOf('1', 3) == 3) {
            noend();
         } else {
            res.error("У Вас нет прав на сохранение!");
            res.redirect(pathname);
         }

      } else {
         res.redirect(pathname);
      }
   }

   function getAccess() {

      if (urlParsed.query.edit) {

         if (permission.indexOf('1', 2) == 2) {

            noend();

         } else {

            res.error("У Вас нет прав на правку!");
            res.redirect(pathname);
         }

      } else if (urlParsed.query.drop) {

         if (permission.indexOf('1', 1) == 1) {

            noend();

         } else {

            res.error("У Вас нет прав на удаление!");
            res.redirect(pathname);
         }

      } else if (urlParsed.query.createBlocks) {

         if (permission.indexOf('1', 3) == 3) {

            noend();

         } else {

            res.error("У Вас нет прав на добавление блока!");
            res.redirect(pathname);
         }

      } else {

         noend();
      }
   }
   
   function submitValidate() {

      if (permission.indexOf('1', 0) != 0) {
         value.status = 0;
         value.main = 0;
      }

      if(urlParsed.query.createBlocks){

         noend();

      } else {

         if (value.title == ' ' || value.alias == ' ' || value.line == ' ') {

            res.error("Полe не может быть пробелом!");
            res.repeatData(
               {
                  title: value.title,
                  alias: value.alias,
                  line: value.line
               });
            res.redirect('back');

         } else if (value.title.length < 1) {
            res.error("Поля отмеченные звёздочкой обязательны для заполнения!");
            res.repeatData(
               {
                  title: value.title,
                  alias: value.alias,
                  line: value.line
               });
            res.redirect('back');
         } else if (value.title.length > 40) {
            res.error(value.title + ' - должно быть не более 40 символов!');
            res.repeatData(
               {
                  title: value.title,
                  alias: value.alias,
                  line: value.line
               });
            res.redirect('back');
         } else if (value.line.length > 36) {
            res.error(value.line + ' - должно быть не более 36 символов!');
            res.repeatData(
               {
                  title: value.title,
                  alias: value.alias,
                  line: value.line
               });
            res.redirect('back');
         } else if (value.alias.length > 40) {
            res.error(value.alias + ' - должно быть не более 40 символов!');
            res.repeatData(
               {
                  title: value.title,
                  alias: value.alias,
                  line: value.line
               });
            res.redirect('back');
         } else if (value.status.length > 1) {
            res.error(value.status + ' - должно быть не более 1 символа!');
            res.redirect('back');
         } else if (value.main.length > 1) {
            res.error(value.main + ' - должно быть не более 1 символа!');
            res.redirect('back');
         } else {

            noend();
         }
      }
   }
   
   function alias() {

      if(urlParsed.query.createBlocks){

         noend();

      } else {

         if (value.latin == 1) {

            if (value.alias.length < 1) {

               value.alias = translite(value.title.trim()).toLowerCase();

               noend();

            } else {

               value.alias = translite(value.alias.trim()).toLowerCase();

               noend();
            }

         } else {

            if (value.alias.length < 1) {

               res.error('Если поле "Псевдоним" отмечено как "original", то поле обязательно для заполнения!');
               res.repeatData(
                  {
                     title: value.title,
                     alias: value.alias
                  });
               res.redirect('back');

            } else {
               noend();
            }
         }

      }
   }
   
   function submitCreate() {
      
      if (value.create) {

         var save = new Layer({

            title: value.title.trim(),
            alias: value.alias.trim(),
            line: value.line.trim(),
            date_create: Date.now(),
            author: req.session.uid,
            template: temp,
            status: value.status,
            main: value.main

         });

         save.isset(function (err, result) {
            if (err) return next(err);

            if (result == 0) {

               res.error("Псевдоним не уникален!");
               res.repeatData(
                  {
                     title: value.title,
                     alias: value.alias
                  });
               res.redirect(pathname);

            } else {

               save.save(function (err, result) {

                  if (err) return next(err);

                  if (result.rowCount == 1 && permission.indexOf('1', 0) != 0) {

                     res.readyOk('Набор блоков будет опубликован после проверки модератором.');
                     res.redirect(pathname);

                  } else if (result.rowCount == 1) {

                     res.readyOk('Запись сохранена.');
                     res.redirect(pathname);

                  } else {
                     res.error("Запись не сохранена!");
                     res.redirect(pathname);
                  }
               });
            }
         });

      } else if(value.createBlocks){

         var layerandblock = new Layer(
            {
               layer_id: urlParsed.query.createBlocks,
               block_id: value.selectBlocks
            }
         );

         layerandblock.addLayerAndBlock(function (err, result) {
            if (err) return next(err);

            if(result.rowCount == 1){
               res.readyOk('Запись сохранена.');
               res.redirect('back');
            } else {
               res.error("Запись не сохранена!");
               res.redirect('back');
            }
         })

      } else {

         noend();
      }
   }
   
   function submitEdit() {
      
      if (value.edit) {

         var edit = new Layer({

            id: urlParsed.query.edit.trim(),
            title: value.title.trim(),
            alias: value.alias.trim(),
            line: value.line.trim(),
            date_create: Date.now(),
            author: req.session.uid,
            template: temp,
            status: value.status,
            main: value.main

         });

         edit.isset(function (err, result) {
            if (err) return next(err);


            if (result == 0) {

               res.error("Псевдоним не уникален!");
               res.repeatData(
                  {
                     title: value.title,
                     alias: value.alias
                  });
               res.redirect(pathname);

            } else {


               if (users == 1) {
                  
                  edit.editEmail(function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount == 1 && permission.indexOf('1', 0) != 0) {

                        res.readyOk('Набор блоков будет опубликован после проверки модератором.');
                        res.redirect(pathname);

                     } else if(result.rowCount == 1){

                        res.readyOk('Запись изменена.');
                        res.redirect(pathname);

                     } else {
                        res.error("Запись не изменена!");
                        res.redirect(pathname);
                     }

                  });

               } else {

                  edit.editId(function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount == 1 && permission.indexOf('1', 0) != 0) {

                        res.readyOk('Набор блоков будет опубликован после проверки модератором.');
                        res.redirect(pathname);

                     } else if (result.rowCount == 1){

                        res.readyOk('Запись изменена.');
                        res.redirect(pathname);

                     } else {
                        res.error("Запись не изменена!");
                        res.redirect(pathname);
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
      
      var drop = new Layer({
         id: urlParsed.query.drop.trim(),
         author: req.session.uid,
         template: temp
      });

      if (users == 1) {

         drop.dropEmail(function (err, result) {
            if (err) return next(err);

            if (result.rowCount == 1) {

               res.readyOk('Запись удалена');
               res.redirect(pathname);

            } else {

               res.error("Запись не удалена!");
               res.redirect(pathname);
            }

         });

      } else {

         drop.dropId(function (err, result) {
            if (err) return next(err);

            if (result.rowCount == 1) {

               res.readyOk('Запись удалена');
               res.redirect(pathname);

            } else {

               res.error("Запись не удалена!");
               res.redirect(pathname);
            }

         });
      }

   }
   
   
   var tasks = [getSection, initialization, accessValue, postAccess, getAccess, submitValidate, alias, submitCreate, submitEdit, submitDrop];
   
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
      'Ь': '', 'Ю': 'YU', 'Я': 'YA', ' ': '-'
   };

   var replacer = function (a) {
      return arr[a] || a
   };

   return str.replace(/[А-яёЁ ]/g, replacer)

}

function blocksSelect(blocks) {
   
   var str = '';

   if(blocks.length == 0){

      str += '<option value="">Нет блоков для набора</option>' + '\n';

   } else {

      for(var i = 0; i < blocks.length; i++){

         str += '<option value="'+ blocks[i].id + '">' + blocks[i].title +' ['+ blocks[i].alias +']' + ' ['+ blocks[i].author +']' + '</option>' + '\n';
      }
   }

   return str;
   
}
