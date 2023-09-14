import ResponseMessages from "../../../../constants/responseMessages.js";
import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import validators from "../../../../utils/validators.js";
import utility from "../../../../utils/utility.js";
import models from "../../../../models/index.js";

/// @route  POST /api/v1/send-register-otp

const sendRegisterOtp = catchAsyncError(async (req, res, next) => {
    const { email, phone } = req.body;

    if (!email) {
        return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
    }

    if (email && !validators.validateEmail(email)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
    }

    if (!phone) {
        return next(new ErrorHandler(ResponseMessages.PHONE_REQUIRED, 400));
    }

    if (phone && !validators.validatePhone(phone)) {
        return next(new ErrorHandler(ResponseMessages.INVALID_PHONE, 400));
    }

    let user = await models.User.findOne({ email });

    if (user.isValid) {
        return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_EXISTS, 400));
    }

    // Generating OTP
    const { otp, expiresAt } = await utility.generateOTP();

    await models.OTP.create({
        otp,
        expiresAt,
        email,
        phone,
    });

    const htmlMessage = `<p>Your OTP is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 15 minutes & usable once.</p>
    <p>If you have not requested this email then, please ignore it.</p>
    <p>
    For any queries, feel free to contact us at
    <a href="mailto:searchin789@gmail.com" target="_blank">searchin789@gmail.com</a>.
    </p>
    <p> If you want know more about Search-In, please visit our website 
        <a href="https://searchin.co.in" target="_blank">here</a>.
    </p>
    <p>This is a auto-generated email. Please do not reply to this email.</p>
    <p>
    Regards, <br />
    Search-In Team
    </p>`;

    try {
        await utility.sendEmail({
            email: email,
            subject: `OTP From Search-In`,
            htmlMessage: htmlMessage,
        });

        await utility.sendSMS({
            phone: user.phone,
            message: `Your OTP is ${otp}. This OTP is valid for 15 minutes & usable once.`,
        });

        res.status(200).json({
            success: true,
            message: ResponseMessages.OTP_SEND_SUCCESS,
            otp: otp
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});

export default sendRegisterOtp;
