const express = require('express');
const Post = require('../../models/Post');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Post.find({}).then((posts) => {
    res.render('admin/posts', { posts });
  }).catch((error) => {
    console.log("Could not fetch posts\n", error);
  });
});

router.get('/create', (req, res) => {
  res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
  const allowComments = !!req.body.allowComments;

  const newPost = new Post({
    title: req.body.title,
    status: req.body.status,
    allowComments: allowComments,
    description: req.body.description
  });

  newPost.save().then((savedPost) => {
    res.redirect('/admin/posts');
  }).catch((error) => {
    console.log('Could not create your post\n', error);
  });
});

module.exports = router;
