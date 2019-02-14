const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  slug: {
    type: String,
  },
});

CategorySchema.plugin(URLSlugs('name', { field: 'slug'}));
module.exports = mongoose.model('Category', CategorySchema);
