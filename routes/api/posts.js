const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Load Input Validator
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/
// @desc    Get posts route
// @access  Public
router.get("/", (req, res) => {
  Post.find({})
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopost: "no post found" }));
});

// @route   GET api/posts/:id
// @desc    Get posts route
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ nopost: "no post found now" });
      }
      res.json(post);
    })
    .catch(err => res.status(404).json({ nopost: "no post found" }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost
      .save()
      .then(post => {
        res.json(post);
      })
      .catch(err => res.json(err));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // if (!profile) {
        //   res.status(404).json({ notfounduser: "user not found" });
        // }
        console.log(profile);
        Post.findById(req.params.id)
          .then(post => {
            // Check for post owner
            console.log(post);
            if (post.user.toString() != req.user.id) {
              return res
                .status(401)
                .json({ notauthorized: "User not authorized" });
            } else {
              // Delete selected post
              post
                .remove()
                .then(() => res.json({ succes: "true" }))
                .catch(err =>
                  res.status(404).json({ postnotfound: "No Post found :)" })
                );
            }
          })
          .catch(err => res.json("No post found"));
      })
      .catch(err => res.json("Not found user"));
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() == req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: "user already liked this post" });
            }

            // Add user id to likes array
            post.likes.unshift({ user: req.user.id });
            post
              .save()
              .then(post => res.json(post))
              .catch(err => res.json(err));
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json("Not found user"));
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Like post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() == req.user.id)
                .length === 0
            ) {
              return res
                .status(400)
                .json({ notliked: "user not yet like this post" });
            }

            // Get remove index user id to likes array
            const removeIndex = post.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);

            // Splice out of array
            post.likes.splice(removeIndex, 1);

            // Save
            post
              .save()
              .then(post => res.json(post))
              .catch(err => res.json(err));
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json("Not found user"));
  }
);

// @route   POST api/posts/comment/:id
// @desc    Comment post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            // if (
            //   post.comments.filter(
            //     comment => comment.user.toString() == req.user.id
            //   ).length > 0
            // ) {
            //   return res
            //     .status(400)
            //     .json({ alreadyliked: "user already commented this post" });
            // }

            // Add comments
            post.comments.unshift({
              user: req.user.id,
              text: req.body.text,
              name: req.body.name,
              avatar: req.body.avatar
            });
            post
              .save()
              .then(post => res.json(post))
              .catch(err => res.json(err));
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json("Not found user"));
  }
);

// @route   POST api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            // check if comment exists
            if (
              post.comments.filter(
                comment => comment._id.toString() === req.params.comment_id
              ).length === 0
            ) {
              return res.status(400).json({ nocomment: "there is no comment" });
            }

            // Get remove index user id to likes array
            const removeIndex = post.comments
              .map(item => item.user.toString())
              .indexOf(req.user.id);

            // Splice out of array
            post.comments.splice(removeIndex, 1);

            // Save
            post
              .save()
              .then(post => res.json(post))
              .catch(err => res.json(err));
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json("Not found user"));
  }
);

module.exports = router;
