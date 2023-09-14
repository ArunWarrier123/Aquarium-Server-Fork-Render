import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// ADD TO GROUP ///

const addToGroups = catchAsyncError(async (req, res, next) => {
  let {
    userId,
    groupIds
  } = req.body;

  groupIds = groupIds.split(',');

  if (!userId) {
    return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
  }

  const user = await models.User.findById(userId).select("_id groups");

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));
  }

  for (const groupId of groupIds) {
    if (!groupId) {
      return next(new ErrorHandler(ResponseMessages.GROUP_ID_REQUIRED, 400));
    }

    const getGroup = await models.Group.findById(groupId).select("_id groupAdmin memberCounts");

    if (!getGroup) {
      return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 400));
    }

    if (String(getGroup.groupAdmin._id) !== String(req.user._id)) {
      return next(new ErrorHandler(ResponseMessages.NOT_GROUP_ADMIN, 400));
    }

    if (String(getGroup.groupAdmin._id) === String(user._id)) {
      return next(new ErrorHandler(ResponseMessages.ALREADY_A_GROUP_ADMIN, 400));
    }

    const userInGroup = await models.User.find({
      "_id": user._id,
      "groups": {
        $in: [getGroup._id]
      }
    });

    if (userInGroup.length !== 0) {
      return next(new ErrorHandler(ResponseMessages.USER_ALREADY_EXISTS_IN_GROUP, 400));
    }

    user.groups.push(getGroup._id);
    await user.save();

    getGroup.memberCounts++;
    await getGroup.save();
  }

  res.status(201).json({
    success: true,
    message: ResponseMessages.USER_ADDED_TO_GROUP,
  });
});

export default addToGroups;