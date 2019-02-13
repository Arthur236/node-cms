const express = require('express');

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

const router = express.Router();

router.post('/:postId', (req, res) => {
  Post.findOne({ _id: req.params.postId }).then((post) => {
    const newComment = new Comment({
      user: req.user.id,
      body: req.body.body,
    });

    post.comments.push(newComment);

    post.save().then((savedPost) => {
      newComment.save().then((savedComment) => {
        res.redirect(`/posts/${savedPost.id}`);
      });
    });
  });
});

router.delete('/:postId/:commentId', (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId).then((deletedComment) => {
    Post.findOneAndUpdate({ comments: req.params.commentId }, { $pull: { comments: req.params.commentId } }, (err, data) => {
      if (err) return err;

      res.redirect( `/posts/${req.params.postId}`);
    });
  });
});

module.exports = router;
