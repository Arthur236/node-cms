const express = require('express');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'index';
  next();
});

router.get('/', (req, res) => {
  req.session.app = 'App';

  res.render('home/index');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/register', (req, res) => {
  res.render('auth/register');
});

module.exports = router;
