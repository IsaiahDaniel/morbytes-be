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
exports.getMovie = exports.getAllMovies = exports.createMovie = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const uuid_1 = require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Movie_1 = __importDefault(require("../models/Movie"));
const getAllMovies = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield Movie_1.default.find();
    res.json({ success: true, data: movies });
}));
exports.getAllMovies = getAllMovies;
const getMovie = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield Movie_1.default.findOne({ _id: req.params.movieId });
    res.json({ success: true, data: movie });
}));
exports.getMovie = getMovie;
const createMovie = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, description } = req.body;
    if (!title || !description) {
        return next(new ErrorMessage_1.default(`Title and Description is required`, 400));
    }
    let posterUrl, videoUrl, subtitleUrl;
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    const posterfile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster[0].originalname.split(".");
    const subtitlefile = (_b = req.files) === null || _b === void 0 ? void 0 : _b.subtitle[0].originalname.split(".");
    const videofile = (_c = req.files) === null || _c === void 0 ? void 0 : _c.video[0].originalname.split(".");
    const posterfileExt = posterfile[posterfile.length - 1];
    const subtitlefileExt = subtitlefile[subtitlefile.length - 1];
    const videofileExt = videofile[videofile.length - 1];
    if (req.files.poster) {
        const moviePosterParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `posters/${(0, uuid_1.v4)()}${Math.random()}.${posterfileExt}`,
            Body: req.files.poster[0].buffer,
            ContentType: req.files.poster[0].mimetype,
        };
        const videoPosterUploadResult = yield s3.upload(moviePosterParams).promise();
        posterUrl = videoPosterUploadResult.Location;
    }
    if (req.files.subtitle) {
        const subtitleParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `subtitle/${(0, uuid_1.v4)()}${Math.random()}.${subtitlefileExt}`,
            Body: req.files.subtitle[0].buffer,
            ContentType: req.files.subtitle[0].mimetype,
        };
        const subtitleUploadResult = yield s3.upload(subtitleParams).promise();
        subtitleUrl = subtitleUploadResult.Location;
    }
    if (req.files.video) {
        const movieParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `movies/${(0, uuid_1.v4)()}${Math.random()}.${videofileExt}`,
            Body: req.files.video[0].buffer,
            ContentType: req.files.video[0].mimetype,
        };
        const movieUploadResult = yield s3.upload(movieParams).promise();
        videoUrl = movieUploadResult.Location;
    }
    const movieData = {
        title,
        description,
        poster: posterUrl,
        videoUrl: videoUrl,
        subtitle: subtitleUrl
    };
    const movie = yield Movie_1.default.create(movieData);
    res.status(200).json({ success: true, data: movie });
}));
exports.createMovie = createMovie;
