"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.activateAccount = exports.forgetPassword = exports.registerUser = exports.loginUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const TokenService_1 = __importDefault(require("../services/TokenService"));
const User_1 = __importDefault(require("../models/User"));
const EmailService_1 = __importDefault(require("../services/EmailService"));
const crypto_1 = __importDefault(require("crypto"));
const templates_1 = require("../lib/templates");
const constants_1 = require("../constants");
const loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!email || !password) {
        return next(new ErrorMessage_1.default(`Please Provide Valid Credentials`, 404));
    }
    if (!user) {
        return next(new ErrorMessage_1.default(`Invalid Credentials`, 404));
    }
    if (!user.emailVerified) {
        return next(new ErrorMessage_1.default(`You must Activate your Account`, 400));
    }
    const passwordMatch = yield user.matchPassword(password);
    if (!passwordMatch) {
        return next(new ErrorMessage_1.default(`Invalid Credentials`, 404));
    }
    const token = (0, TokenService_1.default)(user._id);
    res.status(201).json({ success: true, data: user, token });
}));
exports.loginUser = loginUser;
const registerUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    const userExists = yield User_1.default.findOne({ email });
    if (userExists) {
        return next(new ErrorMessage_1.default("Please try a different Email.", 400));
    }
    const user = yield User_1.default.create({
        email,
        username,
        password,
    });
    const environment = process.env.NODE_ENV === "development"
        ? "http://localhost:5174"
        : `${constants_1.PROD_URL}`;
    const verificationUrl = `${environment}/verify-email/${user.emailVerificationToken}`;
    const verificationTemplate = (0, templates_1.verifyEmailTemplate)(verificationUrl, user.username);
    try {
        (0, EmailService_1.default)({
            to: user.email,
            subject: "Email Verification",
            body: verificationTemplate,
        });
    }
    catch (error) {
        console.log("error", error);
        return next(new ErrorMessage_1.default(`Email could not be sent`, 500));
    }
    res.status(201).json({ success: true, data: user });
}));
exports.registerUser = registerUser;
const activateAccount = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const user = yield User_1.default.findOne({ emailVerificationToken: token });
    if (!user) {
        return next(new ErrorMessage_1.default(`Invalid Token`, 404));
    }
    // if(user.emailVerified){
    //   return next(new ErrorResponse(`Account Already Verified`, 400));
    // }
    const updateUser = yield User_1.default.findOneAndUpdate({ _id: user._id }, { emailVerified: true }, {
        new: true,
    });
    res.status(200).json({ success: true, data: updateUser });
}));
exports.activateAccount = activateAccount;
const forgetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log("email", email);
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorMessage_1.default(`Email could not be sent`, 404));
    }
    const resetToken = user.getResetPasswordToken();
    console.log("reset token 1", resetToken);
    yield user.save();
    const environment = process.env.NODE_ENV === "development"
        ? "http://localhost:5174"
        : `${constants_1.PROD_URL}`;
    const resetUrl = `${environment}/passwordreset/${resetToken}`;
    const passwordResetTemplate = (0, templates_1.forgotPasswordTemplate)(resetUrl, user.username);
    console.log("reset token 2", resetToken);
    try {
        (0, EmailService_1.default)({
            to: user.email,
            subject: "Password Reset Request",
            body: passwordResetTemplate,
        });
        res.status(200).json({ success: true, data: "Email sent" });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        return next(new ErrorMessage_1.default(`Email could not be sent`, 500));
    }
}));
exports.forgetPassword = forgetPassword;
const resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.passwordToken)
        .digest("hex");
    const { password } = req.body;
    const user = yield User_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    console.log("user", user);
    console.log("passwordToken", req.params.passwordToken);
    if (!user) {
        return next(new ErrorMessage_1.default(`Token Expired`, 400));
    }
    if (!password) {
        return next(new ErrorMessage_1.default(`Password is required`, 400));
    }
    if (password.length < 6) {
        return next(new ErrorMessage_1.default(`Password Must be at least six characters`, 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    res.status(201).json({ success: true, data: "Password Reset Success" });
}));
exports.resetPassword = resetPassword;
