var Site = require('./model/index');
var url = require('url');

exports.list = function (req, res, next) {

   var keyRequest = '';
   var main_query ='';
   var template = '';
   var articleList = '';
   var articlePage = '';
   var catalogList = '';
   var catalogPage = '';
   var basicList = '';
   var basicPage = '';
   
   var urlParsed = url.parse(req.url, true);

   var pathname = urlParsed.pathname;
   pathname = decodeURI(pathname);


   function Request() {

      var arrPathname = pathname.split('/');

      if(arrPathname[1] == 'admin'){

         next();

      } else {

         if( pathname.indexOf('/', pathname.length - 1 ) == pathname.length - 1 ){
            pathname = pathname.substring(0, pathname.length - 1);
         }

         var arrPath = pathname.split('/');

         keyRequest = arrPath[arrPath.length - 1].trim();

         noend()
      }
   }

   function mainQuery() {

      var query = new Site({keyRequest: keyRequest});

      query.main_Query(function (err, result) {
         if (err) return next(err);

         if(result.rowCount > 0){

            main_query = result.rows[0];
            noend();

         } else {
            next();
         }
      });
   }

   function listOrPage() {

      if(main_query.template == 'section'){

         var section_list = new Site({id: main_query.id});

         section_list.section_TemplateName(function(err, result){
            if (err) return next(err);

            if(result.rowCount > 0){

               for (var i=0; i < result.rows.length; i++ ){

                  var template = result.rows[i].template_name;
   
                  section_list = new Site({section: main_query.id, template: template});


                  if(template == 'article'){

                     if(result.rows[i].id_one_page != null ){

                        var article_page = new Site({id: result.rows[i].id_one_page});
                        article_page.article_Page(function (err, result) {
                           if (err) return next(err);
                           if(result.rowCount > 0) {

                              articlePage = result.rows[0];

                           } else {
                              next();
                           }
                        })

                     } else {

                        section_list.section_List(function (err, resultList) {
                           if (err) return next(err);

                           articleList = resultList.rows;

                        });
                     }
                  }

                  if(template == 'catalog'){

                     if(result.rows[i].id_one_page != null ){

                        var catalog_page = new Site({id: result.rows[i].id_one_page});
                        catalog_page.catalog_Page(function (err, result) {
                           if (err) return next(err);

                           if(result.rowCount > 0) {

                              catalogPage = result.rows[0];

                           } else {
                              next();
                           }
                        })

                     } else {

                        section_list.section_List(function (err, resultList) {
                           if (err) return next(err);

                           catalogList = resultList.rows;

                        });
                     }
                  }


                  if(template == 'basic'){

                     if(result.rows[i].id_one_page != null ){

                        var basic_page = new Site({id: result.rows[i].id_one_page});
                        basic_page.basic_Page(function (err, result) {
                           if (err) return next(err);
                           if(result.rowCount > 0) {

                              basicPage = result.rows[0];

                           } else {
                              next();
                           }
                        })

                     } else {

                        section_list.section_List(function (err, resultList) {
                           if (err) return next(err);
                           basicList = resultList.rows;
                        });
                     }
                  }
               }
               
               setTimeout(function () {
                  noend();
               }, 200);


            } else {
               next();
            }
         })

      } else {

         if(main_query.template == 'article'){
            var article_page = new Site({id:main_query.id});
            article_page.article_Page(function (err, result) {
               if (err) return next(err);
               if(result.rowCount > 0) {
                  articlePage = result.rows[0];
                  noend();
               } else {
                  next();
               }
            })
         }

         if(main_query.template == 'catalog'){

            var catalog_page = new Site({id:main_query.id});
            catalog_page.catalog_Page(function (err, result) {
               if (err) return next(err);
               if(result.rowCount > 0) {
                  catalogPage = result.rows[0];
                  noend();
               } else {
                  next();
               }
            })
         }

         if(main_query.template == 'basic'){
            var basic_page = new Site({id:main_query.id});
            basic_page.basic_Page(function (err, result) {
               if (err) return next(err);
               if(result.rowCount > 0) {
                  basicPage = result.rows[0];
                  noend();
               } else {
                  next();
               }
            })
         }
      }

   }
   
   function siteRender() {

      res.render('site',
         {
            pathname: pathname,
            articleList: articleList,
            articlePage: articlePage,
            catalogList: catalogList,
            catalogPage: catalogPage,
            basicList: basicList,
            basicPage: basicPage
         }
      );
   }

   var tasks = [ Request, mainQuery, listOrPage, siteRender ];
   function noend() {
      var currentTask = tasks.shift();
      if (currentTask) currentTask();
   }
   noend();

};