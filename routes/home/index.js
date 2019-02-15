const express = require('express');
const Post = require('../../models/Post');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'index';
  next();
});

router.get('/', (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  Post.find({})
    .populate('user')
    .skip((limit * page) - limit)
    .limit(limit)
    .then((posts) => {
      Post.countDocuments().then((postCount) => {
        res.render('home/index', {
          posts,
          currentPage: parseInt(page),
          pages: Math.ceil(postCount / limit)
        });
      });
    }).catch((error) => {
    console.log(error);
  });
});

router.get('/posts/:slug', (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .populate({ path: 'comments', populate: { path: 'user' } })
    .then((post) => {
      res.render('home/post', { post });
    }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;
