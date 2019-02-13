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
    res.render('home/index', {posts});
  }).catch((error) => {
    console.log(error);
  });
});

router.get('/posts/:id', (req, res) => {
  Post.findOne({_id: req.params.id}).populate({path: 'comments', populate: {path: 'user'}})
    .then((post) => {
      res.render('home/post', {post});
    }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;
