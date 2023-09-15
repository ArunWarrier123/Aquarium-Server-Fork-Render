import models from "../../../../models/index.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// DELETE ALL NOTIFICATIONS ///

const deleteAllNotifications = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    if (!userId) return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));

    const user = await models.User.findById(userId);

    if (!user) return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));

    await models.VideoNotification.deleteMany({ user: userId });

    res.status(201).json({
        success: true,
        message: ResponseMessages.ALL_NOTIFICATION_DELETED
    });
});

export default deleteAllNotifications;