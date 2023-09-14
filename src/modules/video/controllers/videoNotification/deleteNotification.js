import models from "../../../../models/index.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// DELETE NOTIFICATION ///

const deleteNotification = catchAsyncError(async (req, res, next) => {
    const notificationId = req.query.notificationId;

    if (!notificationId) return next(new ErrorHandler(ResponseMessages.NOTIFICATION_ID_REQUIRED, 400));

    const notification = await models.VideoNotification.findById(notificationId);

    if (!notification) return next(new ErrorHandler(ResponseMessages.NOTIFICATION_NOT_FOUND, 400));

    await notification.remove();

    res.status(201).json({
        success: true,
        message: ResponseMessages.NOTIFICATION_DELETED
    });
});

export default deleteNotification;