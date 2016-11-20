var ms = require('./msDate');
var nav = require('./navigation');
var striptags = require('striptags');
var conf = require('../config');
var pg = require('pg');
var dbConf = conf.get('db');
var pool = new pg.Pool(dbConf);

exports.tableListArticle = function (req, id_one_page, row, urlParsed, permission, limit, linkLimit, urlPage, result) {
   
   var strPath = nav.linkQuery('edit', 'drop', req);
   
   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      nav.navpage(str, urlParsed, row.rowCount, limit, linkLimit, urlPage, 'page', function(err, resultNav){
         str += resultNav;

         str += '<table border="1">' + '\n';
         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

         }

         str += '\t' + '</tr>' + '\n';

         for (var j = 0; j < result.rows.length; j++) {
            var row = result.rows[j];

            str += '\t' + '<tr>' + '\n';

            var bgcolor = '';

            for (var i = 0; i < result.fields.length; i++) {

               var cols = result.fields[i].name;

               if (result.fields[i].name == 'Редактировать') {
                  if(row[cols] == id_one_page){
                     bgcolor = '#FFFFFF';
                  }
               }

               if(bgcolor != ''){
                  str += '\t\t' + '<td bgcolor="'+bgcolor+'">';
               } else {
                  str += '\t\t' + '<td>';
               }

               if (result.fields[i].name == 'Редактировать') {
                  str += row[cols] + '.';

                  if (permission.indexOf('1', 2) == 2) {
                     str += '&nbsp&nbsp' + '<a class="edit" href="/admin/template/article?edit=' + row[cols] + strPath + '">править</a>';
                  }

                  if (permission.indexOf('1', 1) == 1) {
                     str += '&nbsp&nbsp' + '<a class="drop" href="/admin/template/article?drop=' + row[cols] + strPath + '">удалить</a>';
                  }

               } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
                  str += ms.clip(ms.msDate(row[cols]));
               } else if (result.fields[i].name == 'Автор') {

                  if (row[cols] == conf.get('administrator')) {
                     str += 'администратор';
                  } else if(row[cols] == null) {
                     str += '';
                  } else {
                     str += row[cols];
                  }
               } else if (result.fields[i].name == 'Автор правки') {

                  if (row[cols] == conf.get('administrator')) {
                     str += 'администратор';
                  } else if(row[cols] == null) {
                     str += '';
                  } else {
                     str += row[cols];
                  }
               } else if (result.fields[i].name == 'Статус') {

                  if (row[cols] == 1) {
                     str += '<span class="yes">опубликовано</span>';
                  }

                  if (row[cols] == 0) {
                     str += '<span class="no">ожидает</span>';
                  }

               } else if (result.fields[i].name == 'Главная') {
                  if (row[cols] == 1) {
                     str += 'главная';
                  }

                  if (row[cols] == 0) {
                     str += '';
                  }
               } else if (result.fields[i].name == 'Раздел') {
                  if (row[cols] == null) {
                     str += 'раздел не выбран';
                  } else {
                     str += row[cols];
                  }
               } else if (row[cols] == null) {
                  str += row[cols] = '';
               } else {
                  str += ms.clip(row[cols]);
               }

               str += '</td>' + '\n';

            }
            str += '\t' + '</tr>' + '\n';
         }

         str += '</table>' + '\n';

      });

      return str;
   }
};

exports.tableListCatalog = function (req, id_one_page, row, urlParsed, permission, limit, linkLimit, urlPage, result) {
   
   
   var strPath = nav.linkQuery('edit', 'drop', req);

   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {


      nav.navpage(str, urlParsed, row.rowCount, limit, linkLimit, urlPage, 'page', function(err, resultNav){
         str += resultNav;

         str += '<table border="1">' + '\n';
         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';


         for (var j = 0; j < result.rows.length; j++) {
            var row = result.rows[j];

            str += '\t' + '<tr>' + '\n';
   
            var bgcolor = '';
            
            for (var i = 0; i < result.fields.length; i++) {

               var cols = result.fields[i].name;
   
               if (result.fields[i].name == 'Редактировать') {
                  if(row[cols] == id_one_page){
                     bgcolor = '#FFFFFF';
                  }
               }
   
               if(bgcolor != ''){
                  str += '\t\t' + '<td bgcolor="'+bgcolor+'">';
               } else {
                  str += '\t\t' + '<td>';
               }

               if (result.fields[i].name == 'Редактировать') {
                  str += row[cols] + '.';

                  if (permission.indexOf('1', 2) == 2) {
                     str += '&nbsp&nbsp&nbsp' + '<a class="edit" href="/admin/template/catalog?edit=' + row[cols] + strPath + '">править</a>';
                  }

                  if (permission.indexOf('1', 1) == 1) {
                     str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/catalog?drop=' + row[cols] + strPath + '">удалить</a>';
                  }

               } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
                  str += ms.clip(ms.msDate(row[cols]));
               } else if (result.fields[i].name == 'Автор') {

                  if (row[cols] == conf.get('administrator')) {
                     str += 'администратор';
                  } else if(row[cols] == null) {
                     str += '';
                  } else {
                     str += row[cols];
                  }
               } else if (result.fields[i].name == 'Автор правки') {

                  if (row[cols] == conf.get('administrator')) {
                     str += 'администратор';
                  } else if(row[cols] == null) {
                     str += '';
                  } else {
                     str += row[cols];
                  }
               } else if (result.fields[i].name == 'Статус') {

                  if (row[cols] == 1) {
                     str += '<span class="yes">опубликовано</span>';
                  }

                  if (row[cols] == 0) {
                     str += '<span class="no">ожидает</span>';
                  }

               } else if (result.fields[i].name == 'Главная') {
                  if (row[cols] == 1) {
                     str += 'главная';
                  }

                  if (row[cols] == 0) {
                     str += '';
                  }
               } else if (result.fields[i].name == 'Раздел') {
                  if (row[cols] == null) {
                     str += 'раздел не выбран';
                  } else {
                     str += row[cols];
                  }
               } else if (row[cols] == null) {
                  str += row[cols] = '';
               } else {
                  str += ms.clip(row[cols]);
               }

               str += '</td>' + '\n';

            }
            str += '\t' + '</tr>' + '\n';
         }

         str += '</table>' + '\n';

      });

      return str;
   }
};

exports.tableListBasic = function (req, id_one_page, row, urlParsed, permission, limit, linkLimit, urlPage, result) {

   var strPath = nav.linkQuery('edit', 'drop', req);
   
   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {
   

      nav.navpage(str, urlParsed, row.rowCount, limit, linkLimit, urlPage, 'page', function(err, resultNav){
         str += resultNav;

         str += '<table border="1">' + '\n';
         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

         }

         str += '\t' + '</tr>' + '\n';

         for (var j = 0; j < result.rows.length; j++) {
            var row = result.rows[j];

            str += '\t' + '<tr>' + '\n';

            var bgcolor = '';

            for (var i = 0; i < result.fields.length; i++) {

               var cols = result.fields[i].name;


               if (result.fields[i].name == 'Редактировать') {
                  if(row[cols] == id_one_page){
                     bgcolor = '#FFFFFF';
                  }
               }

               if(bgcolor != ''){
                  str += '\t\t' + '<td bgcolor="'+bgcolor+'">';
               } else {
                  str += '\t\t' + '<td>';
               }

               if (result.fields[i].name == 'Редактировать') {

                  str += row[cols] + '.';

                  if (permission.indexOf('1', 2) == 2) {
                     str += '&nbsp&nbsp' + '<a class="edit" href="/admin/template/basic?edit=' + row[cols] + strPath + '">править</a>';
                  }

                  if (permission.indexOf('1', 1) == 1) {
                     str += '&nbsp&nbsp' + '<a class="drop" href="/admin/template/basic?drop=' + row[cols] + strPath + '">удалить</a>';
                  }

               } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
                  str += ms.clip(ms.msDate(row[cols]));
               } else if (result.fields[i].name == 'Автор') {

                  if (row[cols] == conf.get('administrator')) {
                     str += 'администратор';
                  } else if(row[cols] == null) {
                     str += '';
                  } else {
                     str += row[cols];
                  }
               } else if (result.fields[i].name == 'Автор правки') {

                  if (row[cols] == conf.get('administrator')) {
                     str += 'администратор';
                  } else if(row[cols] == null) {
                     str += '';
                  } else {
                     str += row[cols];
                  }
               } else if (result.fields[i].name == 'Статус') {

                  if (row[cols] == 1) {
                     str += '<span class="yes">опубликовано</span>';
                  }

                  if (row[cols] == 0) {
                     str += '<span class="no">ожидает</span>';
                  }

               } else if (result.fields[i].name == 'Главная') {
                  if (row[cols] == 1) {
                     str += 'главная';
                  }

                  if (row[cols] == 0) {
                     str += '';
                  }
               } else if (result.fields[i].name == 'Раздел') {
                  if (row[cols] == null) {
                     str += 'раздел не выбран';
                  } else {
                     str += row[cols];
                  }
               } else if (row[cols] == null) {
                  str += row[cols] = '';
               } else {
                  str += ms.clip(row[cols]);
               }

               str += '</td>' + '\n';

            }
            str += '\t' + '</tr>' + '\n';
         }

         str += '</table>' + '\n';

      });
      return str;
   }
};

exports.tableListSeotext = function (req, id_one_page, row, urlParsed, permission, limit, linkLimit, urlPage, result) {

   var strPath = nav.linkQuery('edit', 'drop', req);

   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {

      nav.navpage(str, urlParsed, row.rowCount, limit, linkLimit, urlPage, 'page', function(err, resultNav){

         str += resultNav;

         str += '<table border="1">' + '\n';
         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

         }

         str += '\t' + '</tr>' + '\n';

         for (var j = 0; j < result.rows.length; j++) {
            var row = result.rows[j];

            str += '\t' + '<tr>' + '\n';

            var bgcolor = '';

            for (var i = 0; i < result.fields.length; i++) {

               var cols = result.fields[i].name;

               if (result.fields[i].name == 'Редактировать') {
                  if(row[cols] == id_one_page){
                     bgcolor = '#FFFFFF';
                  }
               }

               if(bgcolor != ''){
                  str += '\t\t' + '<td bgcolor="'+bgcolor+'">';
               } else {
                  str += '\t\t' + '<td>';
               }

               if (result.fields[i].name == 'Редактировать') {
                  str += row[cols] + '.';

                  if (permission.indexOf('1', 2) == 2) {
                     str += '&nbsp&nbsp&nbsp' + '<a class="edit" href="/admin/template/seotext?edit=' + row[cols] + strPath + '">править</a>';
                  }

                  if (permission.indexOf('1', 1) == 1) {
                     str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/seotext?drop=' + row[cols] + strPath + '">удалить</a>';
                  }

               } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
                  str += ms.clip(ms.msDate(row[cols]));
               } else if (result.fields[i].name == 'Статус') {

                  if (row[cols] == 1) {
                     str += '<span class="yes">опубликовано</span>';
                  }

                  if (row[cols] == 0) {
                     str += '<span class="no">ожидает</span>';
                  }

               } else if (result.fields[i].name == 'Главная') {
                  if (row[cols] == 1) {
                     str += 'главная';
                  }

                  if (row[cols] == 0) {
                     str += '';
                  }
               } else if (result.fields[i].name == 'Раздел') {
                  if (row[cols] == null) {
                     str += 'раздел не выбран';
                  } else {
                     str += row[cols];
                  }
               } else if (row[cols] == null) {
                  str += row[cols] = '';
               } else {
                  str += ms.clip(row[cols]);
               }

               str += '</td>' + '\n';

            }
            str += '\t' + '</tr>' + '\n';
         }

         str += '</table>' + '\n';

      });

      return str;
   }
};

exports.tableListUsers = function (permission, row, urlParsed, limit, linkLimit, urlPage, result) {
   
   
   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {


      nav.navpage(str, urlParsed, row.rowCount, limit, linkLimit, urlPage, 'page', function(err, result){
         str += result;
      });

      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {

         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

      }
      str += '\t' + '</tr>' + '\n';


      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'Редактирование') {

               str += row[cols] + '. ';

               if (permission.indexOf('1', 1) == 1) str += '<a class="drop" href="/admin/users?drop=' + row[cols] + '">удалить</a>';

            } else if (result.fields[i].name == 'Дата_регистрации' || result.fields[i].name == 'date_hash_url') {

               str += ms.clip(ms.msDate(row[cols]));

            } else if (row[cols] == null) {

               str += 'нет данных';

            } else if (result.fields[i].name == 'Резюме') {

               str += ms.clip(row[cols]);

            } else if (result.fields[i].name == 'Дата_рождения') {

               str += ms.dmgDate(row[cols]);

            } else if (result.fields[i].name == 'Пол') {

               if (row[cols] == 1) str += 'муж.';
               if (row[cols] == 2) str += 'жен.';

            } else {
               str += row[cols];
            }

            str += '</td>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';

      return str;
   }
};

exports.tableListLayer = function (result, permission) {

   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {

         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

      }
      str += '\t' + '</tr>' + '\n';


      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         var bgcolor = 0;

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;
   
            if (result.fields[i].name == 'Редактирование') {
               bgcolor = row[cols];
               bgcolor = bgcolor * bgcolor;
               bgcolor = bgcolor + '';
      
            }
   
            str += '\t\t' + '<td><font color="#'+bgcolor+'">';

            if (result.fields[i].name == 'Редактирование') {
               str += row[cols] + '.';

               if (permission.indexOf('1', 2) == 2) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="edit" href="/admin/template/layer?edit=' + row[cols] + '">править</a>';
               }

               if (permission.indexOf('1', 1) == 1) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/layer?drop=' + row[cols] + '">удалить слой</a>';
               }

               if (permission.indexOf('1', 3) == 3) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="create" href="/admin/template/layer?createBlocks=' + row[cols] + '">добавить блоки к слою</a>';
               }

            } else if (result.fields[i].name == 'id_layerandblock') {

               if (row[cols] == null){
                  str += row[cols] = '';
               } else {
                  str += row[cols] + '.';

                  if (permission.indexOf('1', 1) == 1) {
                     str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/layer?dropStr=' + row[cols] + '">удалить строку</a>';
                  }

               }

            } else if (result.fields[i].name == 'Автор') {

               if (row[cols] == conf.get('administrator')) {
                  str += 'администратор';
               } else if(row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else if (result.fields[i].name == 'Автор правки') {

               if (row[cols] == conf.get('administrator')) {
                  str += 'администратор';
               } else if(row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
               str += ms.clip(ms.msDate(row[cols]));
            } else if (row[cols] == null) {
               str += row[cols] = '';
            } else if (result.fields[i].name == 'Статус') {

               if (row[cols] == 1) {
                  str += '<span class="yes">опубликовано</span>';
               }

               if (row[cols] == 0) {
                  str += '<span class="no">ожидает</span>';
               }

            } else if (result.fields[i].name == 'Главная') {
               if (row[cols] == 1) {
                  str += 'главная';
               }

               if (row[cols] == 0) {
                  str += '';
               }
            } else {
               str += row[cols];
            }


            str += '</td>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      return str;
   }
};

exports.tableListBlock = function (result, permission) {

   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {

         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

      }
      str += '\t' + '</tr>' + '\n';


      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         var bgcolor = 0;

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            if (result.fields[i].name == 'Редактирование') {
               bgcolor = row[cols];
               bgcolor = bgcolor * bgcolor;
               bgcolor = bgcolor + '';

            }

            str += '\t\t' + '<td><font color="#'+bgcolor+'">';

            if (result.fields[i].name == 'Редактирование') {
               str += row[cols] + '.';

               if (permission.indexOf('1', 2) == 2) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="edit" href="/admin/template/block?edit=' + row[cols] + '">править</a>';
               }

               if (permission.indexOf('1', 1) == 1) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/block?drop=' + row[cols] + '">удалить блок</a>';
               }

               if (permission.indexOf('1', 3) == 3) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="create" href="/admin/template/block?createSections=' + row[cols] + '">добавить разделы к блоку</a>';
               }

            } else if (result.fields[i].name == 'Автор') {

               if (row[cols] == conf.get('administrator')) {
                  str += 'администратор';
               } else if(row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else if (result.fields[i].name == 'Автор правки') {

               if (row[cols] == conf.get('administrator')) {
                  str += 'администратор';
               } else if(row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else if (result.fields[i].name == 'id_blockandsection') {

               if (row[cols] == null){
                  str += row[cols] = '';
               } else {
                  str += row[cols] + '.';

                  if (permission.indexOf('1', 1) == 1) {
                     str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/block?dropStr=' + row[cols] + '">удалить строку</a>';
                  }

               }

            } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
               str += ms.clip(ms.msDate(row[cols]));
            } else if (row[cols] == null) {
               str += row[cols] = '';
            } else if (result.fields[i].name == 'Статус') {

               if (row[cols] == 1) {
                  str += '<span class="yes">опубликовано</span>';
               }

               if (row[cols] == 0) {
                  str += '<span class="no">ожидает</span>';
               }

            } else if (result.fields[i].name == 'Главная') {
               if (row[cols] == 1) {
                  str += 'главная';
               }

               if (row[cols] == 0) {
                  str += '';
               }
            } else {
               str += row[cols];
            }


            str += '</td>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      return str;
   }
};

exports.tableListSection = function (result, permission) {
   
   var str = '';
   var id = 0;
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         var cols = '';
         var bgcolor = 0;

         /*       var arr = [];

         //////////////////////////////////////////////////////////////
         for (var i = 0; i < result.fields.length; i++) {
            cols = result.fields[i].name;

            if (result.fields[i].name == 'Редактирование') {

               countRow(row[cols], function(err, result, id_section){
                  arr.push(id_section + ':'+ result.rowCount);
                  console.log(arr);
               })

            }

         }
         //////////////////////////////////////////////////////////////*/

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            cols = result.fields[i].name;

            if (result.fields[i].name == 'Редактирование') {
               bgcolor = row[cols];
               bgcolor = bgcolor * bgcolor;
               bgcolor = bgcolor + '';

            }

            str += '\t\t' + '<td><font color="#'+bgcolor+'">';


            if (result.fields[i].name == 'ID') {

               str += row[cols];
               id = row[cols];

            } else if (result.fields[i].name == 'Редактирование') {

               str += row[cols] + '.';


               if (permission.indexOf('1', 2) == 2) {
                  str += '&nbsp&nbsp' + '<a class="edit" href="/admin/template/section?edit=' + row[cols] + '">править</a>';
               }

               if (permission.indexOf('1', 1) == 1) {
                  str += '&nbsp&nbsp' + '<a class="drop" href="/admin/template/section?drop=' + row[cols] + '">удалить</a>';
               }

               if (permission.indexOf('1', 3) == 3) {
                  str += '&nbsp&nbsp' + '<a class="create" href="/admin/template/section?createTemplate=' + row[cols] + '">шаблон к разделу</a>';
               }
            } else if (result.fields[i].name == 'Блок') {

               var nameBlock = row[cols];

               if (row[cols] == null){
                  str += row[cols] = '';
               } else {
                  str += row[cols];
               }

            } else if (result.fields[i].name == 'Название раздела') {

               str += row[cols];

            } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
               str += ms.clip(ms.msDate(row[cols]));
            } else if (result.fields[i].name == 'Запись') {

               if ( permission.indexOf('1', 2) == 2 || permission.indexOf('1', 3) == 3) {
                  if (row[cols] == null && id != null) {
                     str += '<a href="/admin/template/section?idSectionandtemplate='+id+'&onePage=1">много</a>';
                  } else if(row[cols] == null && id == null) {
                     str += row[cols] = '';
                  } else {
                     str += '<a href="/admin/template/section?idSectionandtemplate='+id+'&onePage=0">одна</a>';
                  }
               }
            } else if (result.fields[i].name == 'Автор') {

               if (row[cols] == conf.get('administrator')) {
                  str += 'администратор';
               } else if(row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }
            } else if (result.fields[i].name == 'Автор правки') {

               if (row[cols] == conf.get('administrator')) {
                  str += 'администратор';
               } else if(row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else if (row[cols] == null) {
               str += row[cols] = '';
            } else if (result.fields[i].name == 'Статус') {

               if (row[cols] == 1) {
                  str += '<span class="yes">опубликовано</span>';
               }

               if (row[cols] == 0) {
                  str += '<span class="no">ожидает</span>';
               }

            } else if (result.fields[i].name == 'Главная') {
               if (row[cols] == 1) {
                  str += 'главная';
               }

               if (row[cols] == 0) {
                  str += '';
               }
            } else {
               str += '<b>' + row[cols] + '</b>';
            }


            str += '</font></td>' + '\n';
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      return str;
   }
};

function countRow(id_section, fn) {

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      client.query("SELECT * FROM node LEFT OUTER JOIN sectionandtemplate ON (id = section_id) " +
         "WHERE template = 'section' AND section_id = $1",
         [id_section], function (err, result) {
            done();
            if (err) return fn(err, null);

            return fn(null, result, id_section);
         });
   });
}

exports.tableListMenu = function (result, permission) {
   
   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {

      
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         var idSection = null;
         var blockName = null;

         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'block_name'){

               blockName = row[cols];

               if(row[cols]){
                  str += row[cols];
               } else {
                  str += '';
               }

            } else if (result.fields[i].name == 'id'){

               idSection = row[cols];

               str += row[cols];

            } else if (result.fields[i].name == 'Название раздела') {
   
               str += row[cols];

               if(!blockName){
                  if (permission.indexOf('1', 2) == 2) {
                     str += '&nbsp&nbsp' + '<a class="edit" href="/admin/template/testMenu?putin=' + idSection + '">вложить</a>';
                  }
               }

            } else if (result.fields[i].name == 'Главная') {
               
               if (row[cols] == 1) {
                  str += 'главная';
               }
               
               if (row[cols] == 0) {
                  str += '';
               }
            
            } else {
               str += row[cols];
            }
            
            
            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      
      return str;
   }
};

exports.tableTemplate = function (result) {
   var str = '';
   var nameTemp = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'Шаблоны') {
               nameTemp = row[cols];
            }

            if (result.fields[i].name == 'Принадлежность шаблона') {

               if (row[cols] == null || row[cols] == 0) {
                  str += '<a href="/admin/administrator/adm_template?name=' + nameTemp + '&sort=1">Системный шаблон</a>';
               }

               if (row[cols] == 1) {
                  str += '<a href="/admin/administrator/adm_template?name=' + nameTemp + '&sort=0">Пользовательский шаблон</a>';
               }

            } else {
               str += row[cols];
            }

            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      return str;
   }
};

exports.tableLayerAndBlock = function (result, permission, createBlocks) {
   
   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'Редактирование') {
               str += row[cols] + '.';

               if (permission.indexOf('1', 1) == 1) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/layer?createBlocks=' + createBlocks + '&dropBlock=' + row[cols] + '">удалить</a>';
               }

            } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
               str += ms.clip(ms.msDate(row[cols]));
            } else if (row[cols] == null) {
               str += row[cols] = '';
            } else if (result.fields[i].name == 'Статус') {

               if (row[cols] == 1) {
                  str += '<span class="yes">опубликовано</span>';
               }

               if (row[cols] == 0) {
                  str += '<span class="no">ожидает</span>';
               }

            } else if (result.fields[i].name == 'Главная') {
               if (row[cols] == 1) {
                  str += 'главная';
               }

               if (row[cols] == 0) {
                  str += '';
               }
            } else {
               str += row[cols];
            }


            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      return str;
   }
};

exports.tableBlockAndSection = function (result, permission, createSections) {
   
   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';
            
            if (result.fields[i].name == 'Редактирование') {
               str += row[cols] + '.';
               
               if (permission.indexOf('1', 1) == 1) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/block?createSections=' + createSections + '&dropSection=' + row[cols] + '">удалить</a>';
               }

            } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
               str += ms.clip(ms.msDate(row[cols]));
            } else if (row[cols] == null) {
               str += row[cols] = '';
            } else if (result.fields[i].name == 'Статус') {
               
               if (row[cols] == 1) {
                  str += '<span class="yes">опубликовано</span>';
               }
               
               if (row[cols] == 0) {
                  str += '<span class="no">ожидает</span>';
               }
               
            } else if (result.fields[i].name == 'Главная') {
               if (row[cols] == 1) {
                  str += 'главная';
               }
               
               if (row[cols] == 0) {
                  str += '';
               }
            } else {
               str += row[cols];
            }
            
            
            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      return str;
   }
};

exports.tableSectionAndTemplate = function (result, permission, createTemplate) {

   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {

         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

      }
      str += '\t' + '</tr>' + '\n';


      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'Шаблоны раздела') {

               str += row[cols];

               if (permission.indexOf('1', 1) == 1) {
                  str += '&nbsp&nbsp&nbsp' + '<a class="drop" href="/admin/template/section?createTemplate='
                     + createTemplate + '&dropTemplate=' + row[cols] + '">удалить</a>';
               }

            } else if (result.fields[i].name == 'Дата создания' || result.fields[i].name == 'Дата правки') {
               str += ms.clip(ms.msDate(row[cols]));
            } else if (row[cols] == null) {
               str += row[cols] = '';
            } else if (result.fields[i].name == 'Статус') {

               if (row[cols] == 1) {
                  str += '<span class="yes">опубликовано</span>';
               }

               if (row[cols] == 0) {
                  str += '<span class="no">ожидает</span>';
               }

            } else if (result.fields[i].name == 'Главная') {
               if (row[cols] == 1) {
                  str += 'главная';
               }

               if (row[cols] == 0) {
                  str += '';
               }
            } else {
               str += row[cols];
            }


            str += '</td>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      return str;
   }
};

exports.tableListRole = function (result) {
   
   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {

         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

      }
      str += '\t' + '</tr>' + '\n';


      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'Администрирование') {

               str += row[cols] + '. ' + '<a class="edit" href="/admin/administrator/adm_access?editRole=' + row[cols] + '">править</a>' +
                  ' ' + '<a class="drop" href="/admin/administrator/adm_access?dropRole=' + row[cols] + '">удалить</a>' +
                  ' ' + '<a class="tune" href="/admin/administrator/adm_access?tuneRole=' + row[cols] + '">настроить роль</a>';

            } else if (result.fields[i].name == 'Роль_для_пользователей') {

               if (row[cols] == 1) {
                  str += 'пользователи';
               } else {
                  str += '';
               }

            } else {

               str += row[cols];
            }

            str += '</td>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';
      return str;
   }

};

exports.tableListRoleUrl = function (result) {
   
   var str = '';
   var id_permit = null;
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {

      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<span class="commentForm" > Таблица зарегестрированных страниц, которые учавствуют в настройках ролей.</span>' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';
            
            if (result.fields[i].name == 'Администрирование') {

               id_permit = row[cols];
               str += row[cols] + '. ' + '<a class="drop" href="/admin/administrator/adm_access?dropRolePage=' + row[cols] + '">удалить</a>';
               
            } else if (result.fields[i].name == 'Просматривать' || result.fields[i].name == 'Сохранять' || result.fields[i].name == 'Править' || result.fields[i].name == 'Удалять' || result.fields[i].name == 'Публиковать') {
               
               if (row[cols] > 0) {
                  str += '<span class="yes">да</span>';
               } else {
                  str += '<span class="no">нет</span>';
               }

            } else if (result.fields[i].name == 'Имя_шаблона') {
               if (row[cols] == null) {
                  str += '<a href="/admin/administrator/adm_access?addName=' + id_permit + '">присвоить имя</a>';
               }

               if (row[cols] != null) {
                  str += '<a href="/admin/administrator/adm_access?addName=' + id_permit + '">' + row[cols] + '</a>';
               }


            } else if (result.fields[i].name == 'Адрес_страницы') {

               str += 'domen' + row[cols];

            } else {
               
               str += row[cols];
            }
            
            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';
      return str;
   }
};

exports.tableTuneRole = function (result, id_role, fn) {

   
   var str = '';
   var id_permit = '';
   var che = [];


   pool.connect( function (err, client, done) {
      if (err) return fn(err);
      client.query('SELECT code, permit_id, role_id FROM access WHERE role_id = $1',
         [id_role], function (err, resultDB) {
            done();
            if (err) return fn(err, null);
            
            if (result.rows.length == 0) {

               return str;

            } else {

               str += '<div class="wrapperTable">' + '\n';
               str += '<div class="table">' + '\n';
               str += '<table border="1">' + '\n';
               str += '\t' + '<tr>' + '\n';
               for (var i = 0; i < result.fields.length; i++) {

                  str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

               }
               str += '\t' + '</tr>' + '\n';


               for (var j = 0; j < result.rows.length; j++) {
                  var row = result.rows[j];

                  str += '\t' + '<tr>' + '\n';
                  for (var i = 0; i < result.fields.length; i++) {

                     var cols = result.fields[i].name;

                     str += '\t\t' + '<td align="center">';

                     if (result.fields[i].name == 'id') {

                        str += row[cols];
                        id_permit = row[cols];

                     } else if (result.fields[i].name == 'Выводить_таблицу') {


                        if (row[cols] > 0) {
                           str += '<input type="checkbox" ';

                           for (var k = 0; k < resultDB.rows.length; k++) {


                              if (resultDB.rows[k].permit_id == id_permit) {
                                 var code = resultDB.rows[k].code;

                                 if (code.indexOf('1', 4) == 4) {
                                    str += 'checked';
                                 }
                              }
                           }

                           str += ' name="administrator[' + id_permit + ']" value="' + row[cols] + '">';
                           che.push(id_permit);
                        } else {
                           str += '';
                        }

                     } else if (result.fields[i].name == 'Сохранять_добавлять') {

                        if (row[cols] > 0) {
                           str += '<input type="checkbox" ';

                           for (var k = 0; k < resultDB.rows.length; k++) {


                              if (resultDB.rows[k].permit_id == id_permit) {
                                 var code = resultDB.rows[k].code;

                                 if (code.indexOf('1', 3) == 3) {
                                    str += 'checked';
                                 }
                              }
                           }

                           str += ' name="administrator[' + id_permit + ']" value="' + row[cols] + '">';
                           che.push(id_permit);
                        } else {
                           str += '';
                        }

                     } else if (result.fields[i].name == 'Править_редактировать') {

                        if (row[cols] > 0) {
                           str += '<input type="checkbox" ';

                           for (var k = 0; k < resultDB.rows.length; k++) {


                              if (resultDB.rows[k].permit_id == id_permit) {
                                 var code = resultDB.rows[k].code;

                                 if (code.indexOf('1', 2) == 2) {
                                    str += 'checked';
                                 }
                              }
                           }

                           str += ' name="administrator[' + id_permit + ']" value="' + row[cols] + '">';
                           che.push(id_permit);
                        } else {
                           str += '';
                        }

                     } else if (result.fields[i].name == 'Удалять') {

                        if (row[cols] > 0) {
                           str += '<input type="checkbox" ';

                           for (var k = 0; k < resultDB.rows.length; k++) {


                              if (resultDB.rows[k].permit_id == id_permit) {
                                 var code = resultDB.rows[k].code;

                                 if (code.indexOf('1', 1) == 1) {
                                    str += 'checked';
                                 }
                              }
                           }

                           str += ' name="administrator[' + id_permit + ']" value="' + row[cols] + '">';
                           che.push(id_permit);
                        } else {
                           str += '';
                        }

                     } else if (result.fields[i].name == 'Публиковать') {

                        if (row[cols] > 0) {
                           str += '<input type="checkbox" ';

                           for (var k = 0; k < resultDB.rows.length; k++) {


                              if (resultDB.rows[k].permit_id == id_permit) {
                                 var code = resultDB.rows[k].code;

                                 if (code.indexOf('1', 0) == 0) {
                                    str += 'checked';
                                 }
                              }
                           }

                           str += ' name="administrator[' + id_permit + ']" value="' + row[cols] + '">';
                           che.push(id_permit);
                        } else {
                           str += '';
                        }

                     } else if (result.fields[i].name == 'Адрес_страницы') {

                        str += 'domen' + row[cols];

                     } else {

                        str += row[cols];
                     }

                     str += '</td>' + '\n';

                  }
                  
                  str += '\t' + '</tr>' + '\n';
               }

               str += '</table>' + '\n';
               str += '</div>' + '\n';
               str += '</div>' + '\n';
               str += '<input type="hidden" name="administrator[id_role]" value="' + id_role + '" />' + '\n';
               str += '<input type="hidden" name="administrator[check]" value="' + che + '" />';
               
               fn(null, str);
            }
         });
   });
};

exports.tableUsers = function (result, roleUsers) {
   
   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<span class="commentForm" > Таблица ролей присвоенные пользователям. Внимание! Если "нет роли для пользователей", ' +
         'нужно создать, иначе зарегистрированные пользователи как минимум не смогут вносить изменения в личном кабинете!</span>' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {

         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';

      }
      str += '\t' + '</tr>' + '\n';


      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'Администрирование') {

               str += row[cols] + '. ' + '<a class="edit" href="/admin/administrator/adm_access?assignRole=' + row[cols] + '">присвоить роль</a>';

            } else if (result.fields[i].name == 'Роль') {

               if (row[cols] == null && roleUsers.rowCount == 0) {

                  str += '<span class="no">нет роли для пользователей</span>';

               } else if (row[cols] == null && roleUsers.rowCount == 1) {

                  str += '<strong>' + roleUsers.rows[0].name_role + '</strong>';

               } else {

                  str += '<strong>' + row[cols] + '</strong>';
               }

            } else if (result.fields[i].name == 'Дата_рождения') {


               if (row[cols] != null) {

                  str += ms.dmgDate(row[cols]);

               } else if (row[cols] == null) {

                  str += 'нет данных';
               }

            } else if (result.fields[i].name == 'Дата_регистрации') {

               str += ms.msDate(row[cols]);

            } else if (result.fields[i].name == 'О_себе') {

               if (row[cols] != null) {
                  str += ms.clip(row[cols]);
               } else if (row[cols] == null) {
                  str += 'нет данных';
               }

            } else if (row[cols] == null) {

               str += 'нет данных';

            } else if (result.fields[i].name == 'Пол') {

               if (row[cols] == 1) str += 'муж.';
               if (row[cols] == 2) str += 'жен.';

            } else {
               str += row[cols];
            }

            str += '</td>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';

      return str;
   }
};

exports.tableAccess = function (result) {
   
   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<span class="commentForm" > Публиковать(0) <b>|</b> Удалять(1) <b>|</b> Править, редактировать(2) <b>|</b> Сохранять, добавлять(3) <b>|</b>  Выводить таблицу(4) </span>' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';

            str += row[cols];
            
            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';
      
      return str;
   }
};

exports.tableOneUsers = function (result, allRoleModerator, oneRoleUsers) {

   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      for (var i = 0; i < result.fields.length; i++) {
         
         str += '\t\t' + '<th>' + result.fields[i].name + '</th>' + '\n';
         
      }
      str += '\t' + '</tr>' + '\n';
      
      
      for (var j = 0; j < result.rows.length; j++) {
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';
            
            if (result.fields[i].name == 'Присвоить_роль') {
               
               var id_user = row[cols];

               str += '<select name="administrator[selectRole]">' + '\n';

               if (oneRoleUsers.rowCount == 1) {
                  var usersRoleId = oneRoleUsers.rows[0].id_role;
                  str += '<option value="' + oneRoleUsers.rows[0].id_role + '">' + oneRoleUsers.rows[0].name_role + '</option>' + '\n';
               }

               for (var j = 0; j < allRoleModerator.rows.length; j++) {

                  str += '<option ';

                  if (result.rows[0].name_role == allRoleModerator.rows[j].name_role) str += 'selected';

                  str += ' value="' + allRoleModerator.rows[j].id_role + '">' + allRoleModerator.rows[j].name_role + '</option>' + '\n';
               }

               str += '</select>' + '\n';

            } else if (result.fields[i].name == 'id_role') {

               if (result.rows[0].id_role != null) {
                  str += result.rows[0].id_role;
               } else {
                  if (oneRoleUsers.rowCount == 1) {
                     str += oneRoleUsers.rows[0].id_role;
                  } else {
                     str += 'нет данных';
                  }
               }

            } else if (result.fields[i].name == 'name_role') {

               if (result.rows[0].id_role != null) {
                  str += result.rows[0].name_role;
               } else {
                  if (oneRoleUsers.rowCount == 1) {
                     str += oneRoleUsers.rows[0].name_role;
                  } else {
                     str += '<span class="no">нет роли для пользователей</span>';
                  }
               }

            } else if (result.fields[i].name == 'date_registration' || result.fields[i].name == 'date_hash_url') {
               
               str += ms.clip(ms.msDate(row[cols]));
               
            } else if (row[cols] == null) {
               
               str += 'нет данных';
               
            } else if (result.fields[i].name == 'resume') {
               
               str += ms.clip(row[cols]);
               
            } else if (result.fields[i].name == 'dob') {
               
               str += ms.dmgDate(row[cols]);
               
            } else if (result.fields[i].name == 'gender') {
               
               if (row[cols] == 1) str += 'муж.';
               if (row[cols] == 2) str += 'жен.';
               
            } else {
               str += row[cols];
            }
            
            str += '</td>' + '\n';
            
         }
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';
      str += '<input type="hidden" name="administrator[id_user]" value="' + id_user + '">' + '\n';
      str += '<input type="hidden" name="administrator[usersRoleId]" value="' + usersRoleId + '">' + '\n';
      
      return str;
   }
};

exports.tableAccessUser = function (users, result) {

   var status = '';

   if (users == 1) status = 'Зарегистрированный пользователь';
   if (users == 0) status = 'Модератор';
   if (users == null) status = '<h3>Администратор</h3>';

   var str = '';
   
   if (users == null) {

      str = status;

      return str;

   } else {

      if (result.rows.length == 0) {

         return str;

      } else {

         str += '<div class="wrapperTable">' + '\n';
         str += '<div class="table">' + '\n';
         str += '<table border="1">' + '\n';
         str += '\t' + '<tr>' + '\n';

         for (var k = 0; k < result.fields.length; k++) {

            str += '\t\t' + '<th>' + result.fields[k].name + '</th>' + '\n';

         }
         str += '\t' + '</tr>' + '\n';

         var count = null;
         var rowspan = result.rows.length;

         for (var j = 0; j < result.rows.length; j++) {

            count = j;

            var row = result.rows[j];

            str += '\t' + '<tr>' + '\n';

            for (var i = 0; i < result.fields.length; i++) {

               /*console.log('i: ' + i);
                console.log('count: ' + count);
                console.log('********************');*/

               var cols = result.fields[i].name;

               if (count == 0 && i == 0 || count == 0 && i == 1) {
                  str += '\t\t' + '<td rowspan="' + rowspan + '">';
               } else if (i == 0 || i == 1) {
                  str += '';
               } else {
                  str += '\t\t' + '<td>';
               }

               if (result.fields[i].name == 'Статус') {

                  if (row[cols] == 1) {

                     if (count == 0 && i == 0) str += 'Зарегистрированный пользователь';
                  }

                  if (row[cols] == null) {

                     if (count == 0 && i == 0) str += 'Модератор';
                  }

               } else if (result.fields[i].name == 'Роль') {

                  if (count == 0 && i == 1) str += row[cols];

               } else if (result.fields[i].name == 'Путь_к_разделам') {

                  str += 'domen' + row[cols];

               } else if (result.fields[i].name == 'Права_доступа_к_разделам') {

                  if (row[cols].indexOf('1', 4) == 4) str += 'Просматривать таблицу, ';
                  if (row[cols].indexOf('1', 3) == 3) str += 'Сохранять, ';
                  if (row[cols].indexOf('1', 2) == 2) str += 'Править, ';
                  if (row[cols].indexOf('1', 1) == 1) str += 'Удалять, ';
                  if (row[cols].indexOf('1', 0) == 0) str += 'Публиковать, ';

               } else {

                  str += row[cols];

               }

               if (count == 0 && i == 0 || count == 0 && i == 1) {
                  str += '\t\t' + '</td>' + '\n';
               } else if (i == 0 || i == 1) {
                  str += '';
               } else {
                  str += '\t\t' + '</td>' + '\n';
               }

            }
            str += '\t' + '</tr>' + '\n';
         }

         str += '</table>' + '\n';
         str += '</div>' + '\n';
         str += '</div>' + '\n';

         return str;
      }
   }
};

function tableSQLfunc(hidden, query, str, fn) {
   
   var strDelete = '';
   var strSelect = '';

   pool.connect( function (err, client, done) {
      if (err) return fn(err);

      if (hidden) {

         strDelete = "DELETE FROM sqltable WHERE query != ";

         if (typeof hidden === 'object') {

            for (var d = 0; d < hidden.length; d++) {

               if (d == 0) strDelete += "'" + hidden[d] + "'";

               if (d > 0)  strDelete += " AND query != '" + hidden[d] + "'";

            }

         } else {
            strDelete = "DELETE FROM sqltable WHERE query != '" + hidden + "'";
         }

      } else {
         strDelete = "DELETE FROM sqltable";
      }

      client.query(strDelete, function (err, result) {
         done();
         if (err) return fn(err);

         pool.connect( function (err, client, done) {
            if (err) return fn(err);

            client.query('INSERT INTO sqltable (str, query) VALUES ($1, $2)',
               [str, query.replace(/['"]/g, "")], function (err, result) {
                  done();
                  if (err) return fn(err);

                  if (hidden) {
                     pool.connect( function (err, client, done) {
                        if (err) return fn(err);

                        if (hidden) {

                           strSelect = 'SELECT str FROM sqltable WHERE query = ';

                           if (typeof hidden === 'object') {

                              for (var s = 0; s < hidden.length; s++) {

                                 if (s == 0) strSelect += "'" + hidden[s] + "'";

                                 if (s > 0)  strSelect += " OR query = '" + hidden[s] + "'";

                              }

                           } else {

                              strSelect += "'" + hidden + "'";
                           }

                           client.query(strSelect, function (err, result) {
                              done();
                              if (err) return fn(err);

                              for (var l = 0; l < result.rows.length; l++) {
                                 str += result.rows[l].str;
                              }


                              return fn(null, str);

                           });
                        }
                     });

                  } else {

                     return fn(null, str);
                  }
               });
         });
      });
   });
}

exports.tableSQL = function (title, hidden, horizontally, query, error, result, fn) {

   var str = '';

   if (horizontally == 1) {

      if (error) {

         str += '<h3 class="no">' + 'ERROR: ' + error + '</h3>' + '\n';
         str += '<h3>' + 'QUERY: ' + query + '</h3>' + '\n';

         tableSQLfunc(hidden, query, str, function (err, result) {

            return fn(null, result);

         });

      } else {

         if (result.rows.length == 0) {

            str += title;
            return fn(null, str);

         } else {
            
            
            str += '<div class="wrapperTable">' + '\n';
            str += title;
            str += '<input type="checkbox" value="' + query.replace(/['"]/g, "") + '" name="sql[hidden]"/>' + '\n';
            str += '<div class="table">' + '\n';
            str += '<table border="1">' + '\n';
            str += '\t' + '<tr>' + '\n';

            for (var k = 0; k < result.fields.length; k++) {

               str += '\t\t' + '<th>' + result.fields[k].name + '</th>' + '\n';

            }

            str += '\t' + '</tr>' + '\n';

            for (var j = 0; j < result.rows.length; j++) {

               var row = result.rows[j];

               str += '\t' + '<tr>' + '\n';

               for (var i = 0; i < result.fields.length; i++) {

                  var cols = result.fields[i].name;

                  str += '\t\t' + '<td>';

                  str += ms.clip300(row[cols]);

                  str += '\t\t' + '</td>' + '\n';

               }

               str += '\t' + '</tr>' + '\n';
            }

            str += '</table>' + '\n';
            str += '</div>' + '\n';
            str += '</div>' + '\n';


            tableSQLfunc(hidden, query, str, function (err, result) {

               return fn(null, result);

            });

         }
      }
   }

   if (horizontally == 0) {

      if (error) {

         str += '<h3 class="no">' + 'ERROR: ' + error + '</h3>' + '\n';
         str += '<h3>' + 'QUERY: ' + query + '</h3>' + '\n';

         tableSQLfunc(hidden, query, str, function (err, result) {

            return fn(null, result);

         });

      } else {

         if (result.rows.length == 0) {

            str += title;
            return fn(null, str);

         } else {

            str += '<div class="wrapperTable">' + '\n';
            str += title;
            str += '<input type="checkbox" value="' + query.replace(/['"]/g, "") + '" name="sql[hidden]"/>' + '\n';
            str += '<div class="table">' + '\n';
            str += '<table border="1">' + '\n';
            str += '\t' + '<tr>' + '\n';

            var row = '';
            var cols = '';


            for (var j = 0; j < result.rows.length; j++) {

               str += '\t\t' + '<hr>' + '\n';

               row = result.rows[j];

               for (var i = 0; i < result.fields.length; i++) {

                  cols = result.fields[i].name;

                  str += '\t\t' + '<p><label class="label">' + cols + '</label>: ' + striptags(row[cols]) + '</p>' + '\n';

               }
            }

            str += '</table>' + '\n';
            str += '</div>' + '\n';
            str += '</div>' + '\n';

         }

         tableSQLfunc(hidden, query, str, function (err, result) {

            return fn(null, result);

         });
      }
   }
};


exports.tableArchiveSQL = function (result) {

   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';

      for (var k = 0; k < result.fields.length; k++) {

         str += '\t\t' + '<th>' + result.fields[k].name + '</th>' + '\n';

      }

      str += '\t' + '</tr>' + '\n';

      for (var j = 0; j < result.rows.length; j++) {

         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'id_sql') {

               str += row[cols] + '. ' + '<a class="no" href="/admin/administrator/adm_sql?dropQuery=' + row[cols] + '">удалить</a>'
                  + ' <a class="yes" href="/admin/administrator/adm_sql?saveQuery=' + row[cols] + '">сохранить</a>'
                  + ' <a class="" href="/admin/administrator/adm_sql?viewsQuery=' + row[cols] + '">представление</a>';

            } else if (result.fields[i].name == 'date') {

               str += ms.msDate(row[cols]);

            } else if (result.fields[i].name == 'error') {

               if (row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else {

               str += row[cols];

            }

            str += '\t\t' + '</td>' + '\n';

         }

         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';

      return str;
   }
};

exports.tableNotebookSQL = function ( result ) {


   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="wrapperNav">' + '\n';
      str += '</div>' + '\n';
      str += '<div class="table">' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';

      for (var k = 0; k < result.fields.length; k++) {

         str += '\t\t' + '<th>' + result.fields[k].name + '</th>' + '\n';

      }

      str += '\t' + '</tr>' + '\n';

      for (var j = 0; j < result.rows.length; j++) {

         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            if (result.fields[i].name == 'id_sql') {

               str += row[cols] + '. ' + '<a class="no" href="/admin/administrator/adm_sql?dropQuery=' + row[cols] + '">удалить</a>'
                  + ' <a class="yes" href="/admin/administrator/adm_sql?editQuery=' + row[cols] + '">редактировать</a>'
                  + ' <a class="" href="/admin/administrator/adm_sql?viewsQuery=' + row[cols] + '">представление</a>';

            } else if (result.fields[i].name == 'description' || result.fields[i].name == 'tags' || result.fields[i].name == 'priority') {

               if (row[cols] == null) {
                  str += '';
               } else {
                  str += row[cols];
               }

            } else {

               str += row[cols];

            }

            str += '\t\t' + '</td>' + '\n';

         }

         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';

      return str;
   }
};

exports.tableEditQuery = function (result) {

   var str = '';

   if (result.rows.length == 0) {

      return str;

   } else {

      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';

      for (var k = 0; k < result.fields.length; k++) {

         str += '\t\t' + '<th>' + result.fields[k].name + '</th>' + '\n';

      }

      str += '\t' + '</tr>' + '\n';

      for (var j = 0; j < result.rows.length; j++) {

         var row = result.rows[j];

         str += '\t' + '<tr>' + '\n';

         for (var i = 0; i < result.fields.length; i++) {

            var cols = result.fields[i].name;

            str += '\t\t' + '<td>';

            str += row[cols];

            str += '\t\t' + '</td>' + '\n';

         }

         str += '\t' + '</tr>' + '\n';
      }

      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';

      return str;
   }

};

exports.tableLesson = function (result) {
   
   var str = '';
   
   if (result.rows.length == 0) {
      
      return str;
      
   } else {
      
      str += '<div class="wrapperTable">' + '\n';
      str += '<div class="table">' + '\n';
      str += '<table border="1">' + '\n';
      str += '\t' + '<tr>' + '\n';
      
      for (var k = 0; k < result.fields.length; k++) {
         
         str += '\t\t' + '<th>' + result.fields[k].name + '</th>' + '\n';
         
      }
      
      str += '\t' + '</tr>' + '\n';
      
      for (var j = 0; j < result.rows.length; j++) {
         
         var row = result.rows[j];
         
         str += '\t' + '<tr>' + '\n';
         
         for (var i = 0; i < result.fields.length; i++) {
            
            var cols = result.fields[i].name;
            
            str += '\t\t' + '<td>';
            
            str += row[cols];
            
            str += '\t\t' + '</td>' + '\n';
            
         }
         
         str += '\t' + '</tr>' + '\n';
      }
      
      str += '</table>' + '\n';
      str += '</div>' + '\n';
      str += '</div>' + '\n';
      
      return str;
   }
   
};