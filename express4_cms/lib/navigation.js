var url = require('url');


exports.navpage = function (str, urlParsed, all, limit, linkLimit, urlPage, varName, fn) {

   if(!urlPage) urlPage = 1;

   var startChar = '&laquo;';
   var prevChar  = '&lsaquo;';
   var nextChar  = '&rsaquo;';
   var endChar   = '&raquo;';
   var queryVars = {};
   
   if( urlPage == 0 ) urlPage = 1;
   
   queryVars = urlParsed.query; 

   if( queryVars[varName] )
   {
      delete queryVars[varName];
   }

   var i = null;
   var strPath = '';

   for(var key in queryVars){

      i++;

      if(i == 1) {
         strPath += key + '=' + queryVars[key];
      }

      if(i > 1) {
         strPath += '&' + key + '=' + queryVars[key];
      }

   }

   var link = urlParsed.pathname + '?' + strPath;

   var pages = Math.ceil( all / limit);

   var pagesArr = {};

   for( i = 0;  i < pages;  i++)
   {
      pagesArr[i+1] = i * limit + limit;
   }

   var allPages = array_chunk(pagesArr, linkLimit);

   var returnUrlPage = '';

   for(var j = 0; j < allPages.length; j++){

      for(var key1 in allPages[j]){

         if( key1*1  ==  urlPage ){
            returnUrlPage = allPages[j];
         }

      }

   }

   var size_queryVars = Object.keys(queryVars).length;

   str += '<div class="wrapperNav">' + '\n';
   str += '<div class="navpage">' + "\n";
   if( urlPage > linkLimit )
   {
      str += '<li><a href="' + link; if( size_queryVars > 0 ) str += '&'; str += varName + '=1">' + startChar + '</a></li>' + "\n";
      str += '<li><a href="' + link; if( size_queryVars > 0 ) str += '&'; str += varName + '=' + ( urlPage - 1 ) + '">' + prevChar + '</a></li>' + "\n";
   }

   if( returnUrlPage )
   {

      for(var key2 in returnUrlPage)
      {
         str += '<li><a href="' + link; if( size_queryVars > 0 ) str += '&'; str += varName + '=' + key2 + '">';
         if( key2 == urlPage ) { str += '<span>' + key2 + '</span>'; }
         if( key2 != urlPage ) { str += key2; } str += '</a></li>' + "\n";
      }
   }

   var url = urlPage*1 + 1;
   if( url > pages) url = pages;
   if( urlPage != pages)
   {
      str += '<li><a href="' + link; if( size_queryVars > 0) str += '&'; str += varName + '=' + url + '">' + nextChar + '</a></li>' + "\n";
      str += '<li><a href="' + link; if( size_queryVars > 0) str += '&'; str += varName + '=' + pages + '">' + endChar + '</a></li>' + "\n";
   }
   str += '</div>' + "\n";
   str += '</div>' + '\n';


   return fn(null, str);

};

function array_chunk( input, size ) {

   var x = null;
   var h = {};
   var n = [];
   var key1 = [];

   var i = null;

   for(var k in input){
      i++
   }

   if(i > size){

      for(var key in input){

         x++;

         h[key]=input[key];

         if( ( x % size ) == 0 ) {

            n.push(h);

            h = {};

            key1=[];
            key1.push(key);

         }
      }

      h = {};

      for(var key3 in input) {

         if(key3*1 > key1[0]*1){
            h[key3]=input[key3];
         }
      }

      n.push(h);

   } else {

      for(var key in input) {
         h[key]=input[key];
      }

      n.push(h);

   }

   return n;
}

exports.linkQuery = function (edit, drop, req) {
   
   var urlParsed = url.parse(req.url, true);
   var queryVars = {};
   
   queryVars = urlParsed.query;
   
   if( queryVars[edit] )
   {
      delete queryVars[edit];
   }
   
   if( queryVars[drop] )
   {
      delete queryVars[drop];
   }
   
   var i = null;
   var strPath = '';
   
   for(var key in queryVars) {
      
      i++;
      
      strPath += '&' + key + '=' + queryVars[key];
   }
   
   return strPath;
   
};
