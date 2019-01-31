const express = require('express');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const { isEmpty } = require('lodash');

const Category = require('../../models/Category');
const Post = require('../../models/Post');

const { uploadDir } = require('../../utils/uploadHelper');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Post.find({}).populate('category').then((posts) => {
    res.render('admin/posts', { posts });
  }).catch((error) => {
    console.log('Could not fetch posts\n', error);
  });
});

router.get('/create', (req, res) => {
  Category.find({}).then((categories) => {
    res.render('admin/posts/create', { categories });
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
    res.render('admin/posts/create', { errors });
  } else {
    const allowComments = !!req.body.allowComments;

    const newPost = new Post();
    newPost.title = req.body.title;
    newPost.status = req.body.status;
    newPost.category = req.body.category;
    newPost.allowComments = allowComments;
    newPost.description = req.body.description;

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
      req.flash('success_message', `The post ${savedPost.title} was successfully created`);

      res.redirect('/admin/posts');
    }).catch((error) => {
      console.log('Could not create your post\n', error);
      res.render('admin/posts/create', { errors: error.errors });
    });
  }
});

router.get('/generate', (req, res) => {
  res.render('admin/posts/generate');
});

router.post('/generate', (req, res) => {
  for (let i = 0; i < req.body.amount; i++) {
    const post = new Post();

    post.title = faker.random.words();
    post.status = 'public';
    post.allowComments = faker.random.boolean();
    post.description = faker.lorem.sentences();

    post.save().then((savedPost) => {
      console.log(`Post ${savedPost.title} created successfully`);
    });
  }

  res.redirect('/admin/posts');
});

router.get('/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).populate('category').then((post) => {
    res.render('admin/posts/view', { post });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.get('/edit/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).populate('category').then((post) => {
    Category.find({}).then((categories) => {
      res.render('admin/posts/edit', { post, categories });
    });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.put('/edit/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
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
      req.flash('success_message', `${updatedPost.title} was updated successfully`);

      res.redirect(`/admin/posts/${post.id}`);
    });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.delete('/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (post.photo !== '') {
      fs.unlink(uploadDir + post.photo, (err) => {
        if (err) console.log(err);
      });
    }

    post.remove().then((deletedPost) => {
      req.flash('success_message', `${deletedPost.title} was deleted successfully`);

      res.redirect('/admin/posts');
    });
  }).catch((error) => {
    console.log('Could not delete that post\n', error);
  });
});

module.exports = router;
