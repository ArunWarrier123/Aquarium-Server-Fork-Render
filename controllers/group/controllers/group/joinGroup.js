import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// JOIN GROUP ///

const joinGroup = catchAsyncError(async (req, res, next) => {
  if (req.method === 'GET') {
    const groupId = req.query.id;

    if (!groupId) {
      return next(new ErrorHandler(ResponseMessages.GROUP_ID_REQUIRED, 400));
    }

    const group = await models.Group.findById(groupId).select("_id groupAdmin memberCounts");;

    if (!group) {
      return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 400));
    }

    if (String(group.groupAdmin._id) === String(req.user._id)) {
      return next(new ErrorHandler(ResponseMessages.ALREADY_A_GROUP_ADMIN, 400));
    }

    const userInGroup = await models.User.find({
      "_id": req.user._id,
      "groups": {
        $in: [group._id]
      }
    })

    if (userInGroup.length !== 0) {
      return next(new ErrorHandler(ResponseMessages.USER_ALREADY_EXISTS_IN_GROUP, 400));
    }

    const user = await models.User.findById(req.user._id).select("_id groups");
    user.groups.push(group._id);
    await user.save();

    group.memberCounts++;
    await group.save();
  }

  if (req.method === 'POST') {
    let {
      groupIds
    } = req.body;

    groupIds = groupIds.split(',');

    for (const groupId of groupIds) {
      const group = await models.Group.findById(groupId).select("_id groupAdmin memberCounts");

      if (!group) {
        return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 400));
      }

      if (String(group.groupAdmin._id) === String(req.user._id)) {
        return next(new ErrorHandler(ResponseMessages.ALREADY_A_GROUP_ADMIN, 400));
      }

      const userInGroup = await models.User.find({
        "_id": req.user._id,
        "groups": {
          $in: [group._id]
        }
      });

      if (userInGroup.length !== 0) {
        return next(new ErrorHandler(ResponseMessages.USER_ALREADY_EXISTS_IN_GROUP, 400));
      }

      const user = await models.User.findById(req.user._id).select("_id groups");
      user.groups.push(group._id);
      await user.save();

      group.memberCounts++;
      await group.save();
    }
  }

  res.status(201).json({
    success: true,
    message: ResponseMessages.USER_ADDED_TO_GROUP,
  });
});

export default joinGroup;