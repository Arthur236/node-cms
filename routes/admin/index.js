const express = require('express');

const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const User = require('../../models/User');

const { userIsAdmin } = require('../../utils/authenticate');

const router = express.Router();

router.all('/*', userIsAdmin, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  const promises = [
    Post.countDocuments().exec(),
    Category.countDocuments().exec(),
    Comment.countDocuments().exec(),
    User.countDocuments().exec(),
  ];

  Promise.all(promises).then(([postCount, categoryCount, commentCount, userCount]) => {
    res.render('admin/index', { postCount, categoryCount, commentCount, userCount });
  });

  // Post.countDocuments({}).then((postCount) => {
  //   Category.countDocuments({}).then((categoryCount) => {
  //     Comment.countDocuments({}).then((commentCount) => {
  //       User.countDocuments({}).then((userCount) => {
  //         res.render('admin/index', { postCount, categoryCount, commentCount, userCount });
  //       });
  //     });
  //   });
  // });
});

module.exports = router;
