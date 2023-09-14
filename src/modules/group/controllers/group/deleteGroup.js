import cloudinary from "cloudinary";
import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// DELETE GROUP ///

const deleteGroup = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const group = await models.Group.findById(req.query.id);

  if (!group) {
    return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 404));
  }

  if (group.groupAdmin.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler(ResponseMessages.UNAUTHORIZED, 401));
  }

  const user = models.User.findById(req.user._id);
  user.groups.remove(group._id);

  const post = models.Post.findOne({ "groupId": group._id });
  await post.remove();

  await group.remove();

  res.status(200).json({
    success: true,
    message: ResponseMessages.GROUP_DELETED,
  });
});

export default deleteGroup;
