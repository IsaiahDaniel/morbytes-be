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
exports.getSupportTicket = exports.getSupportTickets = exports.createSupportTicket = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Support_1 = __importDefault(require("../models/Support"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const cloudinary_1 = __importDefault(require("../lib/utils/cloudinary"));
const createSupportTicket = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, ticket_type, description } = req.body;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
        cloudinary_1.default.uploader.upload(req.file.path, function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return next(new ErrorMessage_1.default(`File Upload Error`, 400));
                }
                const ticketData = {
                    user: req.user.id,
                    title,
                    ticket_type,
                    description,
                    image: result.url,
                };
                const supportTicket = yield Support_1.default.create(ticketData);
                res.status(201).json({ success: true, data: supportTicket });
            });
        });
    }
    const ticketData = {
        user: req.user.id,
        title,
        ticket_type,
        description,
        // image: result.url,
    };
    const supportTicket = yield Support_1.default.create(ticketData);
    res.status(201).json({ success: true, data: supportTicket });
}));
exports.createSupportTicket = createSupportTicket;
const getSupportTickets = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticket_type } = req.query;
    console.log("req.user", req.user);
    const tickets = yield Support_1.default.find({ ticket_type: ticket_type, user: req.user.id }).populate("user");
    res.status(200).json({ success: true, data: tickets });
}));
exports.getSupportTickets = getSupportTickets;
const getSupportTicket = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield Support_1.default.findOne({ _id: req.params.id, user: req.user.id });
    if (!ticket) {
        return next(new ErrorMessage_1.default(`No ticket with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: ticket });
}));
exports.getSupportTicket = getSupportTicket;
