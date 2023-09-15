import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import { sendNotification } from "../../../../firebase/index.js";

/// LIKE/UNLIKE STORY ///

const likeUnlikeStory = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const story = await models.Story.findById(req.query.id).select(["_id", "owner", "likesCount", "mediaFiles"]);

  if (!story) {
    return next(new ErrorHandler(ResponseMessages.STORY_NOT_FOUND, 404));
  }

  const isLiked = await utility.checkIfStoryLiked(story._id, req.user);

  if (isLiked) {
    await models.StoryLike.findOneAndDelete({ story: story._id, user: req.user._id });
    story.likesCount--;

    await story.save();

    res.status(200).json({
      success: true,
      message: ResponseMessages.STORY_UNLIKED,
    });
  } else {
    await models.StoryLike.create({ story: story._id, user: req.user._id });

    story.likesCount++;
    await story.save();

    const notification = await models.Notification.findOne({
      to: story.owner,
      from: req.user._id,
      refId: story._id,
      type: "storyLike",
    });

    const isStoryOwner = await utility.checkIfStoryOwner(story._id, req.user);

    if (!notification && !isStoryOwner) {
      const noti = await models.Notification.create({
        to: isStoryOwner.owner,
        from: req.user._id,
        body: "liked your story",
        refId: isStoryOwner._id,
        type: "storyLike",
      });

      const notificationData = await utility.getNotificationData(noti._id, req.user);

      const fcmToken = await models.FcmToken.findOne({ user: story.owner })
        .select("token");

      if (fcmToken) {
        let image = null;

        image = story.mediaFiles[0].mediaType === "image" ? story.mediaFiles[0].url : story.mediaFiles[0].thumbnail.url;

        await sendNotification(
          fcmToken.token,
          {
            title: "New Like",
            body: `${notificationData.from.uname} liked your story.`,
            type: "Likes",
            image: image,
          }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: ResponseMessages.STORY_LIKED,
    });
  }
});

export default likeUnlikeStory;
