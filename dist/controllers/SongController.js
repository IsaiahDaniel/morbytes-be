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
exports.searchSong = exports.createSong = exports.deleteSong = exports.updateSong = exports.getSong = exports.getSongs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Song_1 = __importDefault(require("../models/Songs/Song"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const uuid_1 = require("uuid");
// @route   GET /api/v1/songs
// @desc    Get All Songs
// @access  Public
const getSongs = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
    };
    const result = yield Song_1.default.paginate({}, options);
    res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalCount: result.totalDocs,
    });
}));
exports.getSongs = getSongs;
// @route   GET /api/v1/songs/:id
// @desc    Get Single Songs
// @access  Public
const getSong = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield Song_1.default.findOne({ _id: req.params.id });
    if (!song) {
        return next(new Error(`No Song with the id ${req.params.id} was found on our server`));
    }
    res.status(200).json({ success: true, data: song });
}));
exports.getSong = getSong;
// @route   PATCH /api/v1/songs/:id
// @desc    Update a Single Song
// @access  Public
const updateSong = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield Song_1.default.findOne({ _id: req.params.id });
    if (!song) {
        return next(new Error(`No Song with the id ${req.params.id} was found on our server`));
    }
    const updatedSong = yield Song_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: updatedSong });
}));
exports.updateSong = updateSong;
// @route   DELETE /api/v1/songs/:id
// @desc    Delete a Song
// @access  Public
const deleteSong = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield Song_1.default.findOne({ _id: req.params.id });
    if (!song) {
        return next(new Error(`No Song with the id ${req.params.id} was found on our server`));
    }
    const deletedSong = yield Song_1.default.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ success: true, data: deletedSong });
}));
exports.deleteSong = deleteSong;
// @route   POST /api/v1/songs
// @desc    Create a Song
// @access  Public
const createSong = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { type, title, genre, artist } = req.body;
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    if (!req.files.audio || !req.files.image) {
        return next(new ErrorMessage_1.default(`An Audio and Image File is required`, 400));
    }
    let audioUrl, imageUrl;
    const audiofile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.audio[0].originalname.split(".");
    const imagefile = (_b = req.files) === null || _b === void 0 ? void 0 : _b.image[0].originalname.split(".");
    const audiofileExt = audiofile[audiofile.length - 1];
    const imagefileExt = imagefile[imagefile.length - 1];
    if (req.files.audio) {
        const audioParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `audio/${(0, uuid_1.v4)()}${Math.random()}.${audiofileExt}`,
            Body: req.files.audio[0].buffer,
            ContentType: req.files.audio[0].mimetype,
        };
        const audioUploadResult = yield s3.upload(audioParams).promise();
        audioUrl = audioUploadResult.Location;
    }
    if (req.files.image) {
        const imageParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `audioImages/${(0, uuid_1.v4)()}${Math.random()}.${imagefileExt}`,
            Body: req.files.image[0].buffer,
            ContentType: req.files.image[0].mimetype,
        };
        const imageUploadResult = yield s3.upload(imageParams).promise();
        imageUrl = imageUploadResult.Location;
    }
    const songData = {
        type,
        title,
        genre,
        artist,
        songUrl: audioUrl,
        image: imageUrl,
    };
    const song = yield Song_1.default.create(songData);
    res.status(200).json({ success: true, data: song });
}));
exports.createSong = createSong;
// @route   GET /api/v1/songs/search?title='loving you'
// @desc    Search For a Song
// @access  Public
const searchSong = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.query.title;
    const regexPattern = new RegExp(String(title), "i");
    const song = yield Song_1.default.find({ title: regexPattern });
    res.status(200).json({ success: true, data: song });
}));
exports.searchSong = searchSong;
