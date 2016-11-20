//var time = require('time');

exports.msDate = function (ms) {

   var d = new Date(ms*1);

var options = {
   day: 'numeric',
   month: 'numeric',
   year: 'numeric',
   hour: 'numeric',
   minute: 'numeric'
};


   var date = d.toLocaleString("ru", options);
   //console.log(date);
   var arrDate = date.split('-');
   var horeMinute = arrDate[2].split(' ');
   var dateEnd = horeMinute[0] + '-' + arrDate[1]+ '-' + arrDate[0] + ' ' + horeMinute[1];

   if(dateEnd == '01-01-1970 03:00'){
      dateEnd = '';
   }



/*
   var obj = time.localtime(ms/1000);

   var day = '';
   var month = '';

   if(obj.dayOfMonth > 9){
      day = obj.dayOfMonth;
   } else {
      day = '0'+ obj.dayOfMonth;
   }

   if(obj.month > 9){
      month = obj.month;
   } else {
      month = '0'+ obj.month;
   }


   var dateEnd = day + '-' + month + '-' + (obj.year - 100 + 2000) + ' ' + obj.hours + ':'+ obj.minutes;

   if(dateEnd == '01-01-1970 03:00'){
      dateEnd = '';
   }
*/

   return dateEnd;
};

exports.dmgDate = function (ms) {
   var d = new Date(ms*1);
   var options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
   };
   
   var date = d.toLocaleString("ru", options);
   var arrDate = date.split('-');
   var dateEnd = arrDate[2]+ '-' + arrDate[1] + '-' + arrDate[0];
   
   if(dateEnd == '01-01-1970 03:00'){
      dateEnd = '';
   }

/*   var obj = time.localtime(ms/1000);

   var day = '';
   var month = '';

   if(obj.dayOfMonth > 9){
      day = obj.dayOfMonth;
   } else {
      day = '0'+ obj.dayOfMonth;
   }

   if(obj.month > 9){
      month = obj.month;
   } else {
      month = '0'+ obj.month;
   }


   var dateEnd = day + '-' + month + '-' + (obj.year - 100 + 2000);

   if(dateEnd == '01-01-1970'){
      dateEnd = '';
   }*/
   
   return dateEnd;
};

exports.clip = function (str) {

   if('string' == typeof str){

      if(str.length > 100){

         var len = str.length;
         var str1 = str.substr(0, 100);
         var str2 = str.substr(100, (len - 1));
         var arrStr2 = str2.split(' ');
         return str1 + arrStr2[0] + '...';

      } else {
         return str;
      }

   } else {
      return str;
   }
};

exports.clip300 = function (str) {
   
   if('string' == typeof str){
      
      if(str.length > 300){
         
         var len = str.length;
         var str1 = str.substr(0, 100);
         var str2 = str.substr(100, (len - 1));
         var arrStr2 = str2.split(' ');
         return str1 + arrStr2[0] + '...';
         
      } else {
         return str;
      }
      
   } else {
      return str;
   }
};

exports.clipnbsp = function (str) {
   
   if(str.length > 100){
      
      var len = str.length;
      var str1 = str.substr(0, 100);
      var str2 = str.substr(100, (len - 1));
      var arrStr2 = str2.split('&nbsp');
      return str1 + arrStr2[0] + '...';
      
   } else {
      return str;
   }
};
