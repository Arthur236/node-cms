const express = require('express');

const Category = require('../../models/Category');

const { userIsAdmin } = require('../../utils/authenticate');

const router = express.Router();

router.all('/*', userIsAdmin, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  Category.find({})
    .skip((limit * page) - limit)
    .limit(limit)
    .then((categories) => {
      Category.countDocuments().then((categoryCount) => {
        res.render('admin/categories', {
          categories,
          currentPage: parseInt(page),
          pages: Math.ceil(categoryCount / limit)
        });
      });
    });
});

router.post('/create', (req, res) => {
  const newCategory = Category({
    name: req.body.name,
  });

  newCategory.save().then((savedCategory) => {
    res.redirect('/admin/categories');
    console.log('The category created successfully');
  });
});

router.get('/edit/:slug', (req, res) => {
  Category.findOne({ slug: req.params.slug }).then((category) => {
    res.render('admin/categories/edit', { category });
  }).catch((error) => {
    console.log('Could not find that category\n', error);
  });
});

router.put('/edit/:slug', (req, res) => {
  Category.findOne({ slug: req.params.slug }).then((category) => {
    category.name = req.body.name;

    category.save().then((updatedCategroy) => {
      res.redirect('/admin/categories');
    });
  }).catch((error) => {
    console.log('Could not find that category\n', error);
  });
});

router.delete('/:slug', (req, res) => {
  Category.findOne({ slug: req.params.slug }).then((category) => {
    category.remove().then((deletedCategory) => {
      req.flash('success_message', 'The category was deleted successfully');

      res.redirect('/admin/categories');
    });
  }).catch((error) => {
    console.log('Could not delete that category\n', error);
  });
});

module.exports = router;
