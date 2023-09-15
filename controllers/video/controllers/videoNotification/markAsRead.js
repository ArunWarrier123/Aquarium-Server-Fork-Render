import models from "../../../../models/index.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// MARK AS READ ///

const markAsRead = catchAsyncError(async (req, res, next) => {
    const notificationId = req.query.notificationId;

    if (!notificationId) return next(new ErrorHandler(ResponseMessages.NOTIFICATION_ID_REQUIRED, 400));

    const notification = await models.VideoNotification.findById(notificationId);

    if (!notification) return next(new ErrorHandler(ResponseMessages.NOTIFICATION_NOT_FOUND, 400));

    if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
    } else return next(new ErrorHandler(ResponseMessages.NOTIFICATION_ALREADY_MARK_AS_READ, 400));

    res.status(201).json({
        success: true,
        message: ResponseMessages.NOTIFICATION_MARK_AS_READ
    });
});

export default markAsRead;