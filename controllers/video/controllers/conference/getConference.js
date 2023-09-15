import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// GET CONFERENCE ///

const getConference = catchAsyncError(async (req, res, next) => {
  if (!req.query.id) {
    return next(new ErrorHandler(ResponseMessages.CONFERENCE_ID_REQUIRED, 400));
  }

  const conference = await models.Conference.findById(req.query.id);

  if (!conference) {
    return next(new ErrorHandler(ResponseMessages.CONFERENCE_NOT_FOUND, 400));
  }

  const conferenceData = await utility.getConferenceData(conference._id, req.user);

  res.status(201).json({
    success: true,
    conference: conferenceData
  });
});

export default getConference;
