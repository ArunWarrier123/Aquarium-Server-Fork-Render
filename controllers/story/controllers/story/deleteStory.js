import cloudinary from "cloudinary";
import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// DELETE STORY ///

const deleteStory = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const story = await models.Story.findById(req.query.id);

  if (!story) {
    return next(new ErrorHandler(ResponseMessages.STORY_NOT_FOUND, 404));
  }

  if (story.owner.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
  }

  if (story.mediaFiles.length > 0) {
    for (let i = 0; i < story.mediaFiles.length; i++) {
      let publicId = story.mediaFiles[i].public_id;
      let mediaType = story.mediaFiles[i].mediaType;

      if (mediaType === "video") {
        let thumbnailPublicId = story.mediaFiles[i].thumbnail.public_id;
        if (thumbnailPublicId) {
          await cloudinary.v2.uploader.destroy(thumbnailPublicId);
        }
        await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });
      } else {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }
  }

  const likes = await models.StoryLike.find({ story: story._id }).select("_id");

  if (likes.length > 0) {
    await models.StoryLike.deleteMany({ _id: { $in: likes } });
  }

  const comments = await models.Comment.find({ story: story._id }).select("_id");

  if (comments.length > 0) {
    await models.Comment.deleteMany({ _id: { $in: comments } });
  }

  if (story.caption) {
    let hashtags = utility.getHashTags(story.caption);
    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = await models.Tag.findOne({ name: hashtags[i] });
      if (hashtag) {
        hashtag.storiesCount--;
        await hashtag.save();
      }
    }
  }

  await story.remove();

  const user = await models.Story.findById(req.user._id);
  user.storiesCount--;
  await user.save();

  res.status(200).json({
    success: true,
    message: ResponseMessages.STORY_DELETED,
  });
});

export default deleteStory;
