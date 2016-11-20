exports.emailLogin = function (str) {
   var arr = str.split('@');
   return arr[0];
};