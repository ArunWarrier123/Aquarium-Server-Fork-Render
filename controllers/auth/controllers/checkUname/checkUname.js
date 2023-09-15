import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";

/// @route  GET api/v1/logout

const checkUname = catchAsyncError(async (req, res, next) => {
    const user = await models.User.findOne({ uname: req.params.uname });

    if (user) {
        return next(new ErrorHandler(ResponseMessages.USER_WITH_USERNAME_EXISTS, 404));
    }

    res.status(200).json({
        success: true,
        message: ResponseMessages.USER_NOT_FOUND,
    });
});

export default checkUname;
