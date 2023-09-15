import catchAsyncError from "../../../../helpers/catchAsyncError.js";
import ErrorHandler from "../../../../helpers/errorHandler.js";
import models from "../../../../models/index.js";
import utility from "../../../../utils/utility.js";
import validators from "../../../../utils/validators.js";
import ResponseMessages from "../../../../constants/responseMessages.js";

/// @route  POST /api/v1/register

const register = catchAsyncError(async (req, res, next) => {
  let {
    // email,
    phone,
    password,
    country,
    state,
    city,
    fullname,
    username,
    bio,
    profileimage,
    interestedarea,
    // uname,
    // type,
    // confirmPassword,
  } = req.body;


  //check for first phase where you check if user already exists thats it
  let exists = await models.User.findOne({ phone: phone })

  if (!state) {
    console.log(exists)
    if (exists) {
      return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_EXISTS, 400));
    }
    else{
      res.json({ "newuser" : true })
      return;
    }

  }

  if (!fullname) {
    return next(new ErrorHandler(ResponseMessages.FIRST_NAME_REQUIRED, 400));
  }

  if (fullname && !validators.validateName(fullname)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_FIRST_NAME, 400));
  }

  // if (!lname) {
  //   return next(new ErrorHandler(ResponseMessages.LAST_NAME_REQUIRED, 400));
  // }

  // if (lname && !validators.validateName(lname)) {
  //   return next(new ErrorHandler(ResponseMessages.INVALID_LAST_NAME, 400));
  // }

  // if (!email) {
  //   return next(new ErrorHandler(ResponseMessages.EMAIL_REQUIRED, 400));
  // }

  // if (email && !validators.validateEmail(email)) {
  //   return next(new ErrorHandler(ResponseMessages.INVALID_EMAIL, 400));
  // }

  if (!phone) {
    return next(new ErrorHandler(ResponseMessages.PHONE_REQUIRED, 400));
  }

  if (phone && !validators.validatePhone(phone)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_PHONE, 400));
  }

  if (!username) {
    return next(new ErrorHandler(ResponseMessages.USERNAME_REQUIRED, 400));
  }

  if (username && !validators.validateUsername(username)) {
    return next(new ErrorHandler(ResponseMessages.INVALID_USERNAME, 400));
  }

  if (!password) {
    return next(new ErrorHandler(ResponseMessages.PASSWORD_REQUIRED, 400));
  }

  // if (!confirmPassword) {
  //   return next(new ErrorHandler(ResponseMessages.CONFIRM_PASSWORD_REQUIRED, 400));
  // }

  const isUsernameAvailable = await utility.checkUsernameAvailable(username);

  if (!isUsernameAvailable) {
    return next(new ErrorHandler(ResponseMessages.USERNAME_NOT_AVAILABLE, 400));
  }

  // uusername = username.toLowerCase();

  // const isPhoneAvailable = await utility.checkPhoneAvailable(phone);

  // if (!isPhoneAvailable) {
  //   return next(new ErrorHandler(ResponseMessages.PHONE_ALREADY_USED, 400));
  // }

  // if (password !== confirmPassword) {
  //   return next(new ErrorHandler(ResponseMessages.PASSWORDS_DO_NOT_MATCH, 400));
  // }

  // let isUserExists = await models.User.findOne({ phone });

  // if (isUserExists) {
  //   return next(new ErrorHandler(ResponseMessages.ACCOUNT_ALREADY_EXISTS, 400));
  // }

  // const ip = utility.getIp(req);

  const user = await models.User.create({
    // email,
    phone,
    password,
    country,
    state,
    city,
    fullname,
    username,
    bio,
    profileimage,
    interestedarea
  });

  if (!user) {
    // console.log("yes")
    return next(new ErrorHandler(ResponseMessages.ACCOUNT_NOT_CREATED, 500));
  }

  // Generating OTP
  // const { otp, expiresAt } = await utility.generateOTP();

  // await models.OTP.create({
  //   otp,
  //   expiresAt,
  //   email,
  //   phone
  // });

  // const htmlMessageWelcome = `<p>Hi ${user.fname},</p>
  // <p>
  //   Thank you so much for creating an account with us. We're glad you're here!
  // </p>
  // <p>
  //   To learn more about our product and services, visit our website
  //   <a href="https://searchin.co.in" target="_blank">here</a>.
  // </p>
  // <p>
  //   For any queries, feel free to contact us at
  //   <a href="mailto:searchin789@gmail.com" target="_blank">searchin789@gmail.com</a>.
  // </p>
  // <p>This is a auto-generated email. Please do not reply to this email.</p>
  // <p>
  //   Regards, <br />
  //   Search-In Team
  // </p>`;

  // const htmlMessageEmailOtp = `<p>Your OTP is:</p>
  //   <h2>${otp}</h2>
  //   <p>This OTP is valid for 15 minutes & usable once.</p>
  //   <p>If you have not requested this email then, please ignore it.</p>
  //   <p>
  //   For any queries, feel free to contact us at
  //   <a href="mailto:searchin789@gmail.com" target="_blank">searchin789@gmail.com</a>.
  //   </p>
  //   <p> If you want know more about Search-In, please visit our website 
  //       <a href="https://searchin.co.in" target="_blank">here</a>.
  //   </p>
  //   <p>This is a auto-generated email. Please do not reply to this email.</p>
  //   <p>
  //   Regards, <br />
  //   Search-In Team
  //   </p>`;

  // try {
  //   await utility.sendEmail({
  //     email: user.email,
  //     subject: `Welcome to Search-In`,
  //     htmlMessage: htmlMessageWelcome,
  //   });

  //   await utility.sendEmail({
  //     email: user.email,
  //     subject: `OTP From Search-In`,
  //     htmlMessage: htmlMessageEmailOtp,
  //   });

  //   await utility.sendSMS({
  //     phone: user.phone,
  //     message: `Your OTP is ${otp}. This OTP is valid for 15 minutes & usable once.`,
  //   });
  // } catch (err) {
  //   console.log(err.message);
  // }

  const tokenObj = await utility.generateAuthToken(user , "user");


  res.status(201).json({
    success: true,
    message: ResponseMessages.SIGNUP_SUCCESS,
    data: {
      user: user._id,
      token: tokenObj.token,
    }
  });
});

export default register;
