"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    console.log("ERRROR", err);
    // console.log("ERRROR", err.ErrorResponse);
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorMessage_1.default(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorMessage_1.default(message, 400);
    }
    // Mongoose validatoin error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        console.log("message", message);
        error = new ErrorMessage_1.default(message, 400);
    }
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: error.message || "Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : null,
    });
};
exports.default = errorHandler;
