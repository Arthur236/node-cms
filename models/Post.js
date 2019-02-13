const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: '',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

module.exports = mongoose.model('Post', PostSchema);
