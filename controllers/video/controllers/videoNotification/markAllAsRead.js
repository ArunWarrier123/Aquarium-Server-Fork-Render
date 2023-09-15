import models from "../../../../models/index.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// MARK ALL AS READ ///

const markAllAsRead = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;

    if (!userId) return next(new ErrorHandler(ResponseMessages.USER_ID_REQUIRED, 400));

    const user = await models.User.findById(userId);

    if (!user) return next(new ErrorHandler(ResponseMessages.USER_NOT_FOUND, 400));

    await models.VideoNotification.updateMany(
        {
            user: userId
        }, {
            isRead: true
        }
    );

    res.status(201).json({
        success: true,
        message: ResponseMessages.NOTIFICATIONS_MARK_AS_READ
    });
});

export default markAllAsRead;