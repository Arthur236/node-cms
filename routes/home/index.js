const express = require('express');
const Post = require('../../models/Post');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'index';
  next();
});

router.get('/', (req, res) => {
  req.session.app = 'App';

  Post.find({}).then((posts) => {
    res.render('home/index', { posts: posts });
  }).catch((error) => {
    console.log(error);
  });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    res.render('home/post', { post: post });
  }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;
