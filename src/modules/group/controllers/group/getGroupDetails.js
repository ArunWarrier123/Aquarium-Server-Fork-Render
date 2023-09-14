import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route GET /api/v1/get-group-details

const getGroupDetails = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  const group = await models.Group.findOne({
    _id: req.query.id
  })

  if (!group) {
    return next(new ErrorHandler(ResponseMessages.GROUP_NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    group: group,
  });
});

export default getGroupDetails;
