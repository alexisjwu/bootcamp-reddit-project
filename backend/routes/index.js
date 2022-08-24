const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/", (req, res) => res.redirect("/api-docs"));

/**
 * Get all posts on the server.
 * @route GET /posts
 * @group Posts - Operations about posts
 * @operationId getPosts
 * @returns {ApiResponseMultiplePosts.model} 200 - An array of posts
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.get("/posts", controllers.posts.index);

/** 
 * Post the dates for each post
 */
router.post("/date", controllers.posts.date);

/**
 * Create a new post.
 * @route POST /posts
 * @param {ApiRequestPost.model} post.body.required - The new post
 * @group Posts - Operations about posts
 * @operationId createPost
 * @returns {ApiResponseSinglePost.model} 201 - The new post stored in the database
 * @returns {ApiResponseError.model}  400 - Schema validation error
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.post("/posts", controllers.posts.store);

/**
 * Get a specific post.
 * @route GET /posts/:id
 * @param {number} id.path.required - The post id
 * @group Posts - Operations about posts
 * @operationId getPost
 * @returns {ApiResponseSinglePost.model} 200 - The post with the corresponding id
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.get("/posts/:id", controllers.posts.get);

/**
 * Edit a specific post.
 * @route PATCH /posts/:id
 * @param {number} id.path.required - The post id
 * @param {ApiRequestPost.model} post.body.required - The edited post
 * @group Posts - Operations about posts
 * @operationId editPost
 * @returns {ApiResponseSinglePost.model} 200 - The edited post stored in the database
 * @returns {ApiResponseError.model}  400 - Schema validation error
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.patch("/posts/:id", controllers.posts.update);

/**
 * Delete a specific post.
 * @route DELETE /posts/:id
 * @param {number} id.path.required - The post id
 * @group Posts - Operations about posts
 * @operationId deletePost
 * @returns {ApiResponseSuccess.model} 200 - Successful deletion
 * @returns {ApiResponseSinglePost.model}  500 - Unexpected error in the backend...
 */
router.delete("/posts/:id", controllers.posts.delete);

/**
 * Create a new top-level comment for the given post.
 * @route POST /posts/:id/comment
 * @param {number} id.path.required - The post id
 * @param {ApiRequestComment.model} comment.body.required - The new comment for the post
 * @group Posts - Operations about posts
 * @operationId addTopLevelComment
 * @returns {ApiResponseSinglePost.model} 201 - The post with the new comment stored in the database
 * @returns {ApiResponseError.model}  400 - Schema validation error
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.post("/posts/:id/comment", controllers.posts.comment);

/**
 * Get all comments on the server.
 * @route GET /comments
 * @group Comments - Operations about comments
 * @operationId getComments
 * @returns {ApiResponseMultipleComments.model} 200 - An array of comments
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.get("/comments", controllers.comments.index);

/**
 * Get a specific comment.
 * @route GET /comments/:id
 * @param {number} id.path.required - The comment id
 * @group Comments - Operations about comments
 * @operationId getComment
 * @returns {ApiResponseSingleComment.model} 200 - The comment with the corresponding id
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.get("/comments/:id", controllers.comments.get);

/**
 * Edit a specific comment.
 * @route PATCH /comments/:id
 * @param {number} id.path.required - The comment id
 * @param {ApiRequestComment.model} comment.body.required - The edited comment
 * @group Comments - Operations about comments
 * @operationId editComment
 * @returns {ApiResponseSingleComment.model} 200 - The edited comment stored in the database
 * @returns {ApiResponseError.model}  400 - Schema validation error
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.patch("/comments/:id", controllers.comments.update);

/**
 * Delete a specific comment.
 * @route DELETE /comments/:id
 * @param {number} id.path.required - The comment id
 * @group Comments - Operations about comments
 * @operationId deleteComment
 * @returns {ApiResponseSuccess.model} 200 - Successful deletion
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.delete("/comments/:id", controllers.comments.delete);

/**
 * Create a new child comment for the given comment.
 * @route POST /comments/:id/comment
 * @param {number} id.path.required - The comment id
 * @param {ApiRequestComment.model} comment.body.required - The new child comment for the given comment
 * @group Comments - Operations about comments
 * @operationId addChildComment
 * @returns {ApiResponseSingleComment.model} 201 - The parent comment with the new child comment stored in the database
 * @returns {ApiResponseError.model}  400 - Schema validation error
 * @returns {ApiResponseError.model}  500 - Unexpected error in the backend...
 */
router.post("/comments/:id/comment", controllers.comments.comment);

router.use("/", (req, res, next) => {
  let status = 500;
  let response = { status: "error", msg: "Internal Server Error" };
  if (res.locals.data) {
    response = { status: "ok", ...res.locals.data };
    status = res.locals.status || 200;
  } else if (res.locals.error) {
    status = res.locals.status || 500;
    response = { status: "error", ...res.locals.error };
  }
  return res.status(status).json(response);
});
module.exports = router;

/**
 * @typedef ApiResponseSuccess
 * @property {string} status.required - "ok"
 */

/**
 * @typedef ApiResponseError
 * @property {string} status.required - "error"
 * @property {string} error.required - the error message
 */

/**
 * @typedef ApiRequestPost
 * @property {string} [author]
 * @property {string} [title]
 * @property {string} [text]
 * @property {number} [upVotes]
 * @property {number} [downVotes]
 */

/**
 * @typedef ApiResponseMultiplePosts
 * @property {string} status.required - "ok"
 * @property {PostResponse[]} posts.required
 */

/**
 * @typedef ApiResponseSinglePost
 * @property {string} status.required - "ok"
 * @property {PostResponse.model} post.required
 */

/**
 * @typedef PostResponse
 * @property {string} id.required
 * @property {string} author.required
 * @property {string} title.required
 * @property {string} text.required
 * @property {number} upVotes.required
 * @property {number} downVotes.required
 * @property {string} createdAt.required
 * @property {string} updatedAt.required
 * @property {CommentResponse[]} comments.required
 */

/**
 * @typedef ApiRequestComment
 * @property {string} [author]
 * @property {string} [text]
 * @property {number} [upVotes]
 * @property {number} [downVotes]
 */

/**
 * @typedef ApiResponseMultipleComments
 * @property {string} status.required - "ok"
 * @property {CommentResponse[]} comments.required
 */

/**
 * @typedef ApiResponseSingleComment
 * @property {string} status.required - "ok"
 * @property {CommentResponse.model} comments.required
 */

/**
 * @typedef CommentResponse
 * @property {string} id.required
 * @property {string} author.required
 * @property {string} text.required
 * @property {number} upVotes.required
 * @property {number} downVotes.required
 * @property {string} createdAt.required
 * @property {string} updatedAt.required
 * @property {CommentResponse[]} comments.required
 */
