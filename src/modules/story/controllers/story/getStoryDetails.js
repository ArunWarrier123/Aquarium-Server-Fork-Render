import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// @route GET /api/v1/get-story-details

const getStoryDetails = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const story = await models.Story.findOne({
    _id: req.query.id,
    storyStatus: "active",
  }).select("_id");

  if (!story) {
    return next(new ErrorHandler(ResponseMessages.STORY_NOT_FOUND, 404));
  }

  const storyDetails = await utility.getStoryData(story._id, req.user);

  res.status(200).json({
    success: true,
    story: storyDetails,
  });
});

export default getStoryDetails;
