import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// ADD MEMBER TO CONFERENCE ///

const addMember = catchAsyncError(async (req, res, next) => {
    let {
        conferenceId,
        userId
    } = req.body;

    if (!conferenceId) {
        return next(new ErrorHandler(ResponseMessages.CONFERENCE_ID_REQUIRED, 400));
    }

    const conference = await models.Conference.findById(conferenceId).select("_id speaker members");

    if (!conference) {
        return next(new ErrorHandler(ResponseMessages.CONFERENCE_NOT_FOUND, 400));
    }

    if (!userId) {
        return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));
    }

    const user = await models.User.findById(userId).select("_id");

    if (!user) {
        return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));
    }

    if (!conference.members.includes(user._id) && conference.speaker.toString() !== user._id.toString()) {
        conference.members.push(user._id);
        await conference.save();
    }
    
    else return next(new ErrorHandler(ResponseMessages.USER_ALREADY_EXISTS_IN_CONFERENCE, 400));

    const conferenceData = await utility.getConferenceData(conference._id, req.user);

    res.status(201).json({
        success: true,
        message: ResponseMessages.USER_ADDED_TO_CONFERENCE,
        conference: conferenceData,
    });
});

export default addMember;