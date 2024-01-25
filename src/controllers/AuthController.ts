import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import ErrorResponse from "../messages/ErrorMessage";
import generateToken from "../services/TokenService";
import User from "../models/User";
import sendEmail from "../services/EmailService";
import crypto from "crypto";
import { forgotPasswordTemplate, verifyEmailTemplate } from "../lib/templates";
import { PROD_URL } from "../constants";

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!email || !password) {
      return next(new ErrorResponse(`Please Provide Valid Credentials`, 404));
    }

    if (!user) {
      return next(new ErrorResponse(`Invalid Credentials`, 404));
    }

    if (!user.emailVerified) {
      return next(new ErrorResponse(`You must Activate your Account`, 400));
    }

    const passwordMatch = await user.matchPassword(password);

    if (!passwordMatch) {
      return next(new ErrorResponse(`Invalid Credentials`, 404));
    }

    const token = generateToken(user._id);

    res.status(201).json({ success: true, data: user, token });
  }
);

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse("Please try a different Email.", 400));
  }

  const user = await User.create({
    email,
    username,
    password,
  });

  const environment =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5174"
      : `${PROD_URL}`;

  const verificationUrl = `${environment}/verify-email/${user.emailVerificationToken}`;

  const verificationTemplate = verifyEmailTemplate(verificationUrl, user.username);

  try {
    sendEmail({
      to: user.email,
      subject: "Email Verification",
      body: verificationTemplate,
    });
  } catch (error) {
    console.log("error", error);
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }

  res.status(201).json({ success: true, data: user });
});

const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    return next(new ErrorResponse(`Invalid Token`, 404));
  }

  // if(user.emailVerified){
  //   return next(new ErrorResponse(`Account Already Verified`, 400));
  // }

  const updateUser = await User.findOneAndUpdate(
    { _id: user._id },
    { emailVerified: true },
    {
      new: true,
    }
  );

  res.status(200).json({ success: true, data: updateUser });
});

const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  console.log("email", email);

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(`Email could not be sent`, 404));
  }

  const resetToken = user.getResetPasswordToken();

  console.log("reset token 1", resetToken);

  await user.save();

  const environment =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5174"
      : `${PROD_URL}`;

  const resetUrl = `${environment}/passwordreset/${resetToken}`;

  const passwordResetTemplate = forgotPasswordTemplate(resetUrl, user.username);

  console.log("reset token 2", resetToken);


  try {
    sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      body: passwordResetTemplate,
    });

    res.status(200).json({ success: true, data: "Email sent", resetToken: resetToken  });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.passwordToken)
    .digest("hex");
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log("user", user);
  console.log("passwordToken", req.params.passwordToken);

  if (!user) {
    return next(new ErrorResponse(`Token Expired`, 400));
  }

  if (!password) {
    return next(new ErrorResponse(`Password is required`, 400));
  }

  if (password.length < 6) {
    return next(
      new ErrorResponse(`Password Must be at least six characters`, 400)
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(201).json({ success: true, data: "Password Reset Success" });
});

export {
  loginUser,
  registerUser,
  forgetPassword,
  activateAccount,
  resetPassword,
};
