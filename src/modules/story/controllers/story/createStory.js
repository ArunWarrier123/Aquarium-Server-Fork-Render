import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// CREATE STORY ///

const createStory = catchAsyncError(async (req, res, next) => {
  let { mediaFiles, caption, visibility, groupId, blur, semi_blur, is_anonymous } = req.body;

  if (!blur) return next(new ErrorHandler(ResponseMessages.BLUR_REQUIRED, 400));
  
  if (!semi_blur) return next(new ErrorHandler(ResponseMessages.SEMI_BLUR_REQUIRED, 400));
  
  mediaFiles = JSON.parse(mediaFiles);

  if (!mediaFiles) {
    return next(new ErrorHandler(ResponseMessages.MEDIA_FILES_REQUIRED, 400));
  }

  if (mediaFiles && mediaFiles.length > 0) {
    for (let i = 0; i < mediaFiles.length; i++) {
      if (!mediaFiles[i].mediaType) {
        return next(new ErrorHandler(ResponseMessages.MEDIA_TYPE_REQUIRED, 400));
      }

      if (!mediaFiles[i].public_id) {
        return next(new ErrorHandler(ResponseMessages.PUBLIC_ID_REQUIRED, 400));
      }

      if (!mediaFiles[i].url) {
        return next(new ErrorHandler(ResponseMessages.URL_REQUIRED, 400));
      }

      if (mediaFiles[i].mediaType === "video") {
        if (!mediaFiles[i].thumbnail) {
          return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_REQUIRED, 400));
        }

        if (!mediaFiles[i].thumbnail.public_id) {
          return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_PUBLIC_ID_REQUIRED, 400));
        }

        if (!mediaFiles[i].thumbnail.url) {
          return next(new ErrorHandler(ResponseMessages.VIDEO_THUMBNAIL_URL_REQUIRED, 400));
        }
      }
    }
  }

  if (!groupId) {
    return next(new ErrorHandler(ResponseMessages.GROUP_ID_REQUIRED, 400));
  }

  let group = await models.Group.findById(groupId).select("_id");
  
  if (!group) {
    return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 400));
  }

  const story = await models.Story.create({
    owner: req.user._id,
    groupId: group._id,
    caption: caption,
    mediaFiles: mediaFiles,
    visibility: visibility,
    blur: blur,
    semi_blur: semi_blur,
    is_anonymous: is_anonymous !== undefined ? is_anonymous: false,
  });

  const user = await models.User.findById(req.user._id).select("_id storiesCount");
  user.storiesCount++;
  await user.save();

  let hashtags = [];
  let mentions = [];

  if (caption) {
    hashtags = utility.getHashTags(caption);
    mentions = utility.getMentions(caption);

    if (mentions.length > 0) {
      for (let i = 0; i < mentions.length; i++) {
        const mentionedUser = await models.User.findOne({ uname: mentions[i] })
          .select(["_id", "uname"]);

        const notification = await models.Notification.findOne({
          to: mentionedUser._id,
          from: req.user._id,
          refId: story._id,
          type: "storyMention"
        });

        const isStoryOwner = await utility.checkIfStoryOwner(story._id, mentionedUser);

        if (mentionedUser && (!notification && !isStoryOwner)) {
          await models.Notification.create({
            to: mentionedUser._id,
            from: req.user._id,
            refId: story._id,
            body: `mentioned you in a story`,
            type: "storyMention"
          });
        }
      }
    }

    for (let i = 0; i < hashtags.length; i++) {
      const tag = await models.Tag.findOne({ name: hashtags[i] });

      if (tag) {
        tag.storiesCount++;
        await tag.save();
      } else {
        await models.Tag.create({
          name: hashtags[i],
          storiesCount: 1,
        });
      }
    }
  }

  const storyData = await utility.getStoryData(story._id, req.user);
  
  res.status(201).json({
    success: true,
    message: ResponseMessages.STORY_CREATE_SUCCESS,
    story: storyData,
  });
});

export default createStory;
