const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Post', PostSchema);
