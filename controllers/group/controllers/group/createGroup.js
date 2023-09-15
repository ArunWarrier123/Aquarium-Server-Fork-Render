import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// CREATE GROUP ///

const createGroup = catchAsyncError(async (req, res, next) => {
  let { groupName, groupDescription, groupProfileImage } = req.body;

  if (!groupName) {
    return next(new ErrorHandler(ResponseMessages.GROUP_NAME_REQUIRED, 400));
  }
  
  const isGroupNameAvailable = await utility.checkGroupNameAvailable(groupName);

  if (!isGroupNameAvailable) {
    return next(new ErrorHandler(ResponseMessages.GROUP_NAME_NOT_AVAILABLE, 400));
  }

  if (!groupDescription) {
    return next(new ErrorHandler(ResponseMessages.GROUP_DESCRIPTION_REQUIRED, 400));
  }

  if (!groupProfileImage) {
    return next(new ErrorHandler(ResponseMessages.GROUP_PROFILE_IMAGE_REQUIRED, 400));
  }

  const group = await models.Group.create({
    groupName: groupName,
    groupDescription: groupDescription,
    groupProfileImage: groupProfileImage,
    groupAdmin: req.user._id
  });

  group.memberCounts++;
  await group.save();

  let groupData = await models.Group.findOne({ groupName: groupName });

  let user = await models.User.findById(req.user._id).select("_id groups");;
  user.groups.push(groupData._id);
  await user.save();

  res.status(201).json({
    success: true,
    message: ResponseMessages.GROUP_CREATE_SUCCESS,
    group: groupData,
  });
});

export default createGroup;
