const express = require('express');
const Post = require('../../models/Post');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'index';
  next();
});

router.get('/', (req, res) => {
  req.session.app = 'App';

  Post.find({}).populate('user').then((posts) => {
    res.render('home/index', { posts });
  }).catch((error) => {
    console.log(error);
  });
});

router.get('/posts/:slug', (req, res) => {
  Post.findOne({ slug: req.params.slug }).populate({ path: 'comments', populate: { path: 'user' } })
    .then((post) => {
      res.render('home/post', { post });
    }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;
