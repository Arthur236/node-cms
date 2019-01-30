const express = require('express');

const Category = require('../../models/Category');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  Category.find({}).then((categories) => {
    res.render('admin/categories', { categories });
  });
});

router.post('/create', (req, res) => {
  const newCategory = Category({
    name: req.body.name,
  });

  newCategory.save().then((savedCategory) => {
    res.redirect('/admin/categories');
    console.log(`${savedCategory.name} category created successfully`);
  });
});

router.get('/edit/:id', (req, res) => {
  Category.findOne({ _id: req.params.id }).then((category) => {
    res.render('admin/categories/edit', { category });
  }).catch((error) => {
    console.log('Could not find that category\n', error);
  });
});

router.put('/edit/:id', (req, res) => {
  Category.findOne({ _id: req.params.id }).then((category) => {
    category.name = req.body.name;

    category.save().then((updatedCategroy) => {
      res.redirect('/admin/categories');
    });
  }).catch((error) => {
    console.log('Could not find that category\n', error);
  });
});

router.delete('/:id', (req, res) => {
  Category.findOne({ _id: req.params.id }).then((category) => {
    category.remove().then((deletedCategory) => {
      req.flash('success_message', `${deletedCategory.name} was deleted successfully`);

      res.redirect('/admin/categories');
    });
  }).catch((error) => {
    console.log('Could not delete that category\n', error);
  });
});

module.exports = router;
