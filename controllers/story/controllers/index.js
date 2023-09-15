import createStory from "./story/createStory.js";
import getStories from "./story/getStories.js";
import likeUnlikeStory from "./story/likeUnlikeStories.js";
import deleteStory from "./story/deleteStory.js";
import getStoryDetails from "./story/getStoryDetails.js";
import addComment from "./comment/addComment.js";
import getComments from "./comment/getComments.js";
import likeUnlikeComment from "./comment/likeUnlikeComment.js";
import deleteComment from "./comment/deleteComment.js";
import createUploadStory from "./story/createUploadStory.js";
import getLikedUsers from "./story/getLikedUsers.js";
import reportStory from "./story/reportStory.js";
import reportComment from "./comment/reportComment.js";
import addCommentReply from "./comment/addCommentReply.js";
import likeUnlikeCommentReply from "./comment/likeUnlikeCommentReply.js";
import getCommentReplies from "./comment/getCommentReplies.js";
import deleteCommentReply from "./comment/deleteCommentReply.js";
import reportCommentReply from "./comment/reportCommentReply.js";
import getStoriesByGroup from "./story/getStoriesByGroup.js";
import getAllStories from "./story/getAllStories.js";

const storyController = {};

storyController.createStory = createStory;
storyController.getStories = getStories;
storyController.getAllStories = getAllStories;
storyController.likeUnlikeStory = likeUnlikeStory;
storyController.deleteStory = deleteStory;
storyController.getStoryDetails = getStoryDetails;
storyController.getStoriesByGroup = getStoriesByGroup;
storyController.addComment = addComment;
storyController.getComments = getComments;
storyController.likeUnlikeComment = likeUnlikeComment;
storyController.deleteComment = deleteComment;
storyController.createUploadStory = createUploadStory;
storyController.getLikedUsers = getLikedUsers;

storyController.reportStory = reportStory;
storyController.reportComment = reportComment;

storyController.addCommentReply = addCommentReply;
storyController.likeUnlikeCommentReply = likeUnlikeCommentReply;
storyController.getCommentReplies = getCommentReplies;
storyController.deleteCommentReply = deleteCommentReply;
storyController.reportCommentReply = reportCommentReply;

export default storyController;
