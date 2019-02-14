const express = require('express');
const faker = require('faker');
const fs = require('fs');
const { isEmpty } = require('lodash');

const Category = require('../../models/Category');
const Post = require('../../models/Post');

const { uploadDir } = require('../../utils/uploadHelper');
const { userIsAuthenticated } = require('../../utils/authenticate');

const router = express.Router();

router.all('/*', userIsAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'index';
  next();
});

router.get('/', (req, res) => {
  Post.find({ user: req.user.id }).populate('category').populate('user').then((posts) => {
    res.render('users/posts', { posts });
  }).catch((error) => {
    console.log('Could not fetch your posts\n', error);
  });
});

router.get('/create', (req, res) => {
  Category.find({}).then((categories) => {
    res.render('users/posts/create', { categories });
  });
});

router.post('/create', (req, res) => {
  const errors = {};

  if (!req.body.title) {
    errors.title = 'Please add a title';
  }

  if (!req.body.description) {
    errors.description = 'Please add a description';
  }

  if (!isEmpty(errors)) {
    res.render('users/posts/create', { errors });
  } else {
    const allowComments = !!req.body.allowComments;

    const newPost = new Post();
    newPost.title = req.body.title;
    newPost.status = req.body.status;
    newPost.category = req.body.category;
    newPost.allowComments = allowComments;
    newPost.description = req.body.description;
    newPost.user = req.user;

    if (!isEmpty(req.files)) {
      const file = req.files.photo;
      const filename = `${Date.now()} - ${file.name}`;

      file.mv(uploadDir + filename, (error) => {
        if (error) {
          console.log(error);
        }
      });

      newPost.photo = filename;
    }

    newPost.save().then((savedPost) => {
      req.flash('success_message', 'The post was successfully created');

      res.redirect('/user/posts');
    }).catch((error) => {
      console.log('Could not create your post\n', error);
      res.render('users/posts/create', { errors: error.errors });
    });
  }
});

router.get('/:slug', (req, res) => {
  Post.findOne({ slug: req.params.slug }).populate('category').populate('user').then((post) => {
    if (post.user.id !== req.user.id) {
      req.flash('error_message', 'The post you are looking for either does not exist or does not belong to you');

      return res.redirect('/user/posts')
    }

    res.render('users/posts/view', { post });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.get('/edit/:slug', (req, res) => {
  Post.findOne({ slug: req.params.slug }).populate('category').populate('user').then((post) => {
    if (post.user.id !== req.user.id) {
      req.flash('error_message', 'The post you are looking for either does not exist or does not belong to you');

      return res.redirect('/user/posts')
    }

    Category.find({}).then((categories) => {
      res.render('users/posts/edit', { post, categories });
    });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.put('/edit/:slug', (req, res) => {
  Post.findOne({ slug: req.params.slug }).populate('user').then((post) => {
    if (post.user.id !== req.user.id) {
      req.flash('error_message', 'The post you are looking for either does not exist or does not belong to you');

      return res.redirect('/user/posts')
    }

    const allowComments = !!req.body.allowComments;

    post.title = req.body.title;
    post.status = req.body.status;
    post.category = req.body.category;
    post.allowComments = allowComments;
    post.description = req.body.description;

    if (!isEmpty(req.files)) {
      const file = req.files.photo;
      const filename = `${Date.now()} - ${file.name}`;

      if (post.photo !== '') {
        fs.unlink(uploadDir + post.photo, (err) => {
          if (err) console.log(err);
        });
      }

      file.mv(uploadDir + filename, (error) => {
        if (error) {
          console.log(error);
        }
      });

      post.photo = filename;
    }

    post.save().then((updatedPost) => {
      req.flash('success_message', 'The post was updated successfully');

      res.redirect(`/user/posts/${post.slug}`);
    }).catch((error) => {
      req.flash('error_message', error.message);

      res.redirect(`/user/posts/edit/${post.slug}`);
    });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.delete('/:slug', (req, res) => {
  Post.findOne({ slug: req.params.slug }).populate('comments').populate('user').then((post) => {
    if (post.user.id !== req.user.id) {
      req.flash('error_message', 'The post you are looking for either does not exist or does not belong to you');

      return res.redirect('/user/posts')
    }

    if (post.photo !== '') {
      fs.unlink(uploadDir + post.photo, (err) => {
        if (err) console.log(err);
      });
    }

    if (!post.comments.length < 1) {
      post.comments.forEach(comment => {
        comment.remove();
      });
    }

    post.remove().then((deletedPost) => {
      req.flash('success_message', 'The post was deleted successfully');

      res.redirect('/user/posts');
    });
  }).catch((error) => {
    console.log('Could not delete that post\n', error);
  });
});

module.exports = router;
