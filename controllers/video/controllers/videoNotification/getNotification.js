import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// GET NOTIFICATION ///

const getNotification = catchAsyncError(async (req, res, next) => {
    const notificationId = req.query.notificationId;

    if (!notificationId) return next(new ErrorHandler(ResponseMessages.NOTIFICATION_ID_REQUIRED, 400));

    const notification = await models.VideoNotification.findOne({
        _id: notificationId
    });

    if (!notification) return next(new ErrorHandler(ResponseMessages.NOTIFICATION_NOT_FOUND, 400));

    const notificationData = await utility.getVideoNotificationData(notification._id, req.user);

    res.status(201).json({
        success: true,
        notification: notificationData
    });
});

export default getNotification;
