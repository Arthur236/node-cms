const express = require('express');

const { userIsAdmin } = require('../../utils/authenticate');

const router = express.Router();

router.all('/*', userIsAdmin, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  res.render('admin/index');
});

module.exports = router;
