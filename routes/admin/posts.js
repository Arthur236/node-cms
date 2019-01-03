const express = require('express');
const faker = require('faker');

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

router.get('/generate', (req, res) => {
  res.render('admin/posts/generate');
});

router.post('/generate', (req, res) => {
  for(let i = 0; i < req.body.amount; i++) {
    const post = new Post();

    post.title = faker.random.words();
    post.status = "public";
    post.allowComments = faker.random.boolean();
    post.description = faker.lorem.sentences();

    post.save().then((savedPost) => {});
  }

  res.redirect('/admin/posts');
});

router.get('/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    res.render('admin/posts/view', { post });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.get('/edit/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    res.render('admin/posts/edit', { post });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.put('/edit/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    const allowComments = !!req.body.allowComments;

    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.description = req.body.description;

    post.save().then((updatedPost) => {
      res.redirect(`/admin/posts/${post.id}`);
    });
  }).catch((error) => {
    console.log('Could not find that post\n', error);
  });
});

router.delete('/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((deletedPost) => {
    res.redirect('/admin/posts');
  }).catch((error) => {
    console.log('Could not delete that post\n', error);
  });
});

module.exports = router;
