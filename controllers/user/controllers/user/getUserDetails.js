import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";

/// @route GET /api/v1/user-details

const getUserDetails = catchAsyncError(async (req, res, next) => {

  let searchQuery;

  if (!req.query.id && !req.query.username) {
    return next(new ErrorHandler(ResponseMessages.INVALID_QUERY_PARAMETERS, 400));
  }

  let user;

  if (req.query.id && req.query.username) {
    searchQuery = { _id: req.query.id, uname: req.query.username };
    user = await models.User.findOne(searchQuery);
  }

  else if (req.query.id) {
    searchQuery = { _id: req.query.id };
    user = await models.User.findOne(searchQuery).select("_id");
  }

  else if (req.query.username) {
    searchQuery = { uname: req.query.username };
    user = await models.User.findOne(searchQuery).select("uname");
  }

  if (!user) {
    return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 404));
  }

  const userDetails = await utility.getUserProfileData(user._id, req.user);
  
  res.status(200).json({
    success: true,
    message: ResponseMessages.USER_DETAILS_FETCHED,
    user: userDetails,
  });
});

export default getUserDetails;
