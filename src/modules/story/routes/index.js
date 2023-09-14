import { Router } from "express";
import multerMiddleware from "../../../middlewares/multer.js";
import authMiddleware from "../../../middlewares/auth.js";
import storyController from "../controllers/index.js";

const storyRouter = Router();

const isAuthenticatedUser = authMiddleware.isAuthenticatedUser;

// Authenticated Routes -------------------------------------------------------

storyRouter
  .route("/create-story")
  .post(
    isAuthenticatedUser,
    storyController.createStory
  );

storyRouter
  .route("/create-upload-story")
  .post(
    multerMiddleware.array("mediaFiles"),
    isAuthenticatedUser,
    storyController.createUploadStory
  );

storyRouter
  .route("/get-stories")
  .get(isAuthenticatedUser, storyController.getStories);

storyRouter
  .route("/get-all-stories")
  .get(isAuthenticatedUser, storyController.getAllStories);

storyRouter
  .route("/get-stories-by-group")
  .post(isAuthenticatedUser, storyController.getStoriesByGroup);

storyRouter
  .route("/like-story")
  .get(isAuthenticatedUser, storyController.likeUnlikeStory);

storyRouter
  .route('/get-story-liked-users')
  .get(isAuthenticatedUser, storyController.getLikedUsers);

storyRouter
  .route("/story")
  .get(isAuthenticatedUser, storyController.getStoryDetails)
  .delete(isAuthenticatedUser, storyController.deleteStory);
// .put(isAuthenticatedUser, updatePost)

storyRouter
  .route("/report-story")
  .post(isAuthenticatedUser, storyController.reportStory);

/// COMMENTS ///

storyRouter
  .route("/add-comment")
  .post(isAuthenticatedUser, storyController.addComment);

storyRouter
  .route("/get-comments")
  .get(isAuthenticatedUser, storyController.getComments);

storyRouter
  .route("/like-comment")
  .get(isAuthenticatedUser, storyController.likeUnlikeComment);

storyRouter
  .route("/delete-comment")
  .delete(isAuthenticatedUser, storyController.deleteComment);

storyRouter
  .route("/report-comment")
  .post(isAuthenticatedUser, storyController.reportComment);


/// Comment Reply

/// @route POST /api/v1/add-comment-reply
storyRouter
  .route("/add-comment-reply")
  .post(isAuthenticatedUser, storyController.addCommentReply);

/// @route GET /api/v1/post/like-comment-reply
storyRouter
  .route("/like-comment-reply")
  .get(isAuthenticatedUser, storyController.likeUnlikeCommentReply);

/// @route GET /api/v1/post/get-comment-replies
storyRouter
  .route("/get-comment-replies")
  .get(isAuthenticatedUser, storyController.getCommentReplies);

/// @route DELETE /api/v1/post/delete-comment-reply
storyRouter
  .route("/delete-comment-reply")
  .delete(isAuthenticatedUser, storyController.deleteCommentReply);

/// @route POST /api/v1/post/report-comment-reply
/// @desc Report Comment Reply
/// @access Private
storyRouter
  .route("/report-comment-reply")
  .post(isAuthenticatedUser, storyController.reportCommentReply);

export default storyRouter;
