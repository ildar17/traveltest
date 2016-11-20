var conf = require('../../config');
var mycrypto = require('../../lib/decrypto');
var dataFormat = require('../../lib/dataFormat');
var Auth = require('./model/index');

var sum = null;
var a = null;
var b = null;

exports.registerForm = function (req, res) {

   if(req.session.uid){

      res.redirect('/admin/template/admin');

   } else {

      var sess = req.session;

      if (!sess.views) {
         sess.views = 1;

         a = parseInt(Math.random() * 10);
         b = parseInt(Math.random() * 10);

         res.repeatData({captcha: a + ' + ' + b + ' = ?'});
         sum = a + b;
         res.redirect('/admin/register');

      } else {

         a = parseInt(Math.random() * 10);
         b = parseInt(Math.random() * 10);

         if (sess.views != 1) {
            res.repeatData({captcha: a + ' + ' + b + ' = ?'});
            sum = a + b;
         }

         sess.views++;
         res.render('auth/register', {title: 'Регистрация'});
      }
   }


};

exports.registerSubmit = function (req, res, next) {
   if (sum != req.body.user.captcha) {

      res.error("Сумма подсчитана неверно");
      res.redirect('back');

   } else {

      if (!req.body.user.email || !req.body.user.pass) {
         res.error("Поле обязательно для заполнения!");
         res.redirect('back');

      } else {

         var submitEmail = req.body.user.email.trim();
         var submitPass = req.body.user.pass.trim();
         var submitRemember = req.body.user.remember;

         if (submitEmail.length > 41) {
            res.error(submitEmail + ' - должно быть меньше 40 символов!');
            res.repeatData({email: submitEmail, pass: submitPass});
            res.redirect('back');
         } else if (!(submitEmail.indexOf('.') > 0 && submitEmail.indexOf('@') > 0) || /[^a-zA-Z0-9.@_-]/.test(submitEmail)) {
            res.error(submitEmail + ' - электронный адрес имеет неверный формат!');
            res.repeatData({email: submitEmail, pass: submitPass});
            res.redirect('back');
         } else if (submitPass.length > 13) {
            res.error(submitPass + ' - должно быть не более 12 символов!');
            res.repeatData({email: submitEmail, pass: submitPass});
            res.redirect('back');

         } else {

            Auth.getByName(submitEmail, function (err, user) {
               if (err) return next(err);

               if (user.email) {
                  res.error("Данная электронная почта уже зарегистрирована!");
                  res.repeatData({email: submitEmail, pass: submitPass});
                  res.redirect('back');
               } else {

                  user = new Auth({
                     email: submitEmail,
                     pass: submitPass,
                     login: dataFormat.emailLogin(submitEmail),
                     date_registration: Date.now()
                  });



                  user.getRole(function (err, result) {
                     if (err) return next(err);

                     if(result.rowCount > 0 || conf.get('administrator') == submitEmail){

                        user.save(function (err, result) {
                           if (err) return next(err);

                           if (result > 0) {
                              req.session.uid = user.email;

                              if (submitRemember == 1) {
                                 var email = mycrypto.encrypt(user.email);
                                 res.cookie('user', email, {maxAge: conf.get("maxAge"), signed: true, httpOnly: true});
                              }

                              res.redirect('/admin/template/admin');

                           } else {

                              res.repeatData({email: submitEmail, pass: submitPass});
                              res.error("Ваши учётные данные не сохранились, обратитесь к администратору сайта!");
                              res.redirect('back');
                           }
                        });

                     } else {
                        res.error("Вы не можете зарегистрироваться, не созданы роли. Обратитесь к администратору" +
                           " сайта!");
                        res.redirect('back')
                     }
                  });
               }
            });
         }
      }
   }
};

exports.loginForm = function (req, res) {

   if(req.session.uid){

      res.redirect('/admin/template/admin');

   } else {

      var sess = req.session;


      if (!sess.views) {
         sess.views = 1;

         a = parseInt(Math.random() * 10);
         b = parseInt(Math.random() * 10);

         res.repeatData({captcha: a + ' + ' + b + ' = ?'});
         sum = a + b;
         res.redirect('/admin/login');

      } else {

         a = parseInt(Math.random() * 10);
         b = parseInt(Math.random() * 10);

         if (sess.views != 1) {
            res.repeatData({captcha: a + ' + ' + b + ' = ?'});
            sum = a + b;
         }

         sess.views++;
         res.render('auth/login', {title: 'Авторизация'});
      }
   }


};

exports.loginSubmit = function (req, res, next) {
   if (sum != req.body.user.captcha) {
      
      res.error("Сумма подсчитана неверно");
      res.redirect('back');
      
   } else {
      
      if (!req.body.user.email || !req.body.user.pass) {
         res.error("Поле обязательно для заполнения!");
         res.redirect('back');
         
      } else {
         
         var submitEmail = req.body.user.email.trim();
         var submitPass = req.body.user.pass.trim();
         var submitRemember = req.body.user.remember;
         
         
         if (submitEmail.length > 41) {
            res.error(submitEmail + ' - должно быть меньше 40 символов!');
            res.repeatData({email: submitEmail, pass: submitPass});
            res.redirect('back');
         } else if (!(submitEmail.indexOf('.') > 0 && submitEmail.indexOf('@') > 0) || /[^a-zA-Z0-9.@_-]/.test(submitEmail)) {
            res.error(submitEmail + ' - электронный адрес имеет неверный формат!');
            res.repeatData({email: submitEmail, pass: submitPass});
            res.redirect('back');
         } else if (submitPass.length > 13) {
            res.error(submitPass + ' - должно быть не более 12 символов!');
            res.repeatData({email: submitEmail, pass: submitPass});
            res.redirect('back');
            
         } else {

            Auth.authenticate(submitEmail, submitPass, function (err, user) {
               if (err) return next(err);
               
               if (user) {
                  
                  req.session.uid = user.email;
                  
                  if (submitRemember == 1) {
                     var email = mycrypto.encrypt(user.email);
                     res.cookie('user', email, {maxAge: conf.get("maxAge"), signed: true, httpOnly: true});
                  }
                  
                  res.redirect('/admin/template/admin');
                  
               } else {
                  res.error("Сожалею! Неверные учетные данные.");
                  res.repeatData({email: submitEmail, pass: submitPass});
                  res.redirect('back');
               }
            });
         }
      }
   }
};

exports.rebuildForm = function (req, res) {

   if(req.session.uid){

      res.redirect('/admin/template/admin');

   } else {

      var sess = req.session;

      if (!sess.views) {
         sess.views = 1;

         a = parseInt(Math.random() * 10);
         b = parseInt(Math.random() * 10);

         res.repeatData({captcha: a + ' + ' + b + ' = ?'});
         sum = a + b;
         res.redirect('/admin/recovery');

      } else {

         a = parseInt(Math.random() * 10);
         b = parseInt(Math.random() * 10);

         if (sess.views != 1) {
            res.repeatData({captcha: a + ' + ' + b + ' = ?'});
            sum = a + b;
         }

         sess.views++;

         res.render('auth/rebuild', {title: 'Восстановление пароля'});
      }
   }
};

exports.rebuildSubmit = function (req, res, next) {


   if (sum != req.body.user.captcha) {

      res.error("Сумма подсчитана неверно");
      res.redirect('back');

   } else {
      if (!req.body.user.rebuild) {
         res.error("Поле обязательно для заполнения!");
         res.redirect('back');

      } else {

         var submitEmail = req.body.user.rebuild.trim();

         if (submitEmail.length > 41) {
            res.error(submitEmail + ' - должно быть меньше 40 символов!');
            res.repeatData({email: submitEmail});
            res.redirect('back');
         } else if (!(submitEmail.indexOf('.') > 0 && submitEmail.indexOf('@') > 0) || /[^a-zA-Z0-9.@_-]/.test(submitEmail)) {
            res.error(submitEmail + ' - электронный адрес имеет неверный формат!');
            res.repeatData({email: submitEmail});
            res.redirect('back');
         } else {

            Auth.getByNameRebuild(submitEmail, function (err, email) {
               if (err) return next(err);
               if (!email) {
                  res.error("Данная электронная почта не зарегистрирована!");
                  res.repeatData({email: submitEmail});
                  res.redirect('back');
               } else {

                  Auth.recordHashUrl(submitEmail, function (err, result) {
                     if (err) return next(err);

                     if (result.rowCount == 1) {

                        /////////////////////////////////
                        // Здесь нужно отправить почту
                        ////////////////////////////////
                        var dateСurrent = conf.get('dateEmail') / 1000 / 60 / 60;

                        res.readyOk("На указанный Вами электронный адрес отправленно сообщение с инструкцией для восстановления пароля. " +
                           "Инструкция действительна в течении " + Math.round(dateСurrent) + " часов");
                        res.redirect('back');
                     }
                  });
               }
            });
         }
      }
   }
};

exports.recoveryForm = function (req, res, next) {

   if(req.session.uid){

      res.redirect('/admin/template/admin');

   } else {

      Auth.getHashUrl(req.params.hashEmail.trim(), function (err, hashUrl) {
         if (err) return next(err);

         if (!hashUrl) {
            res.redirect('/admin/recovery');
         } else {
            if (hashUrl.date_hash_url > Date.now()) {
               res.render('auth/recovery', {title: 'Восстановление пароля'});
            } else {
               res.error("Время для воостановления пароля истекло, отправьте новую заявку для восстановления пароля!");
               res.redirect('/admin/recovery');
            }
         }

      });
   }
};

exports.recoverySubmit = function (req, res, next) {

   if (!req.body.user.pass) {

      res.error("Поле обязательно для заполнения!");
      res.redirect('back');

   } else {

      var submitPass = req.body.user.pass.trim();
      var hash_url = req.params.hashEmail.trim();

      if (submitPass.length > 13) {
         res.error(submitPass + ' - должно быть не более 12 символов!');
         res.redirect('back');

      } else {

         Auth.saveNewPass(submitPass, hash_url, function (err, result) {
            if (err) return next(err);

            if (result.rowCount == 1) {
               res.redirect('/admin/login');
            }
         })
      }
   }
};