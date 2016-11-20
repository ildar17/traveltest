var express = require('express');
var router = express.Router();
var conf = require('../config/index');
var main = require('./main/index');
var auth = require('./auth/index');
var admin = require('./template/admin');
var adm_access = require('./administrator/adm_access/index');
var adm_sql = require('./administrator/adm_sql/index');
var adm_template = require('./administrator/adm_template/index');
var users = require('./template/users/index');
var layer = require('./template/layer/index');
var block = require('./template/block/index');
var section = require('./template/section/index');
var testMenu = require('./template/testMenu/index');
var article = require('./template/article/index');
var catalog = require('./template/catalog/index');
var basic = require('./template/basic/index');
var site = require('./site/index');



router.get('/', main.index);

router.get(/^.*$/, site.list);

router.get('/admin/register', auth.registerForm)
   .post('/admin/register', auth.registerSubmit);

router.get('/admin/login', auth.loginForm)
   .post('/admin/login', auth.loginSubmit);

router.get('/admin/recovery', auth.rebuildForm)
   .post('/admin/recovery', auth.rebuildSubmit);

router.get(conf.get('pathEmail') + '/:hashEmail', auth.recoveryForm)
   .post(conf.get('pathEmail') + '/:hashEmail', auth.recoverySubmit);

router.get('/admin/logout', function (req, res, next) {
   req.session.destroy(function (err) {
      if (err) next(err);
      res.clearCookie('user');
      res.redirect('/');
   })
});

router.get('/admin/administrator/adm_access', adm_access.list)
   .post('/admin/administrator/adm_access', adm_access.submit);
router.get('/admin/administrator/adm_sql', adm_sql.list)
   .post('/admin/administrator/adm_sql', adm_sql.submit);
router.get('/admin/administrator/adm_template', adm_template.list);

router.get('/admin/template/admin', admin.list)
   .post('/admin/template/admin', admin.submit);

router.get('/admin/template/users', users.list)
   .post('/admin/template/users', users.submit);

router.get('/admin/template/layer', layer.list)
   .post('/admin/template/layer', layer.submit);

router.get('/admin/template/block', block.list)
   .post('/admin/template/block', block.submit);

router.get('/admin/template/section', section.list)
   .post('/admin/template/section', section.submit);

router.get('/admin/template/testMenu', testMenu.list)
   .post('/admin/template/testMenu', testMenu.submit);

router.get('/admin/template/article', article.list)
   .post('/admin/template/article', article.submit);

router.get('/admin/template/catalog', catalog.list)
   .post('/admin/template/catalog', catalog.submit);

router.get('/admin/template/basic', basic.list)
   .post('/admin/template/basic', basic.submit);

module.exports = router;