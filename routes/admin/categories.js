const express = require('express');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const { isEmpty } = require('lodash');

const Category = require('../../models/Category');

const router = express.Router();

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});

router.get('/', (req, res) => {
  res.render('admin/categories/index');
});

router.post('/create', (req, res) => {
  const newCategory = Category({
    name: req.body.name,
  });

  newCategory.save().then((savedCategory) => {
    res.render('admin/categories/index');
    console.log(savedCategory.name, 'category created successfully');
  });
});

module.exports = router;
