import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import ResponseMessages from "../../../../constants/responseMessages.js";
import models from "../../../../models/index.js";
import validators from "../../../../utils/validators.js";

/// @route POST api/v1/report-story

const reportStory = catchAsyncError(async (req, res, next) => {
    let { storyId, reportReason } = req.body;

    if (!storyId) {
        return next(new ErrorHandler(ResponseMessages.STORY_ID_REQUIRED, 400));
    }

    if (!reportReason) {
        return next(new ErrorHandler(ResponseMessages.REPORT_REASON_REQUIRED, 400));
    }

    if (!validators.isValidObjectId(storyId)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_STORY_ID, 400));
    }

    const reporter = req.user._id;

    const storyReport = await models.StoryReport.create({
        story: storyId,
        reporter,
        reportReason,
    });

    if (!storyReport) {
        return next(new ErrorHandler(ResponseMessages.REPORT_NOT_CREATED, 500));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.REPORT_CREATED,
        data: storyReport,
    });
});

export default reportStory;
