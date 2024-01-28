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
exports.addCommentToMovie = exports.getAllMoviesByGenre = exports.searchMovie = exports.getMovie = exports.getAllMovies = exports.createMovie = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const uuid_1 = require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const Movie_1 = __importDefault(require("../models/movies/Movie"));
// @route   GET /api/v1/movies
// @desc    Get All Movies
// @access  Public
const getAllMovies = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
    };
    const result = yield Movie_1.default.paginate({}, options);
    res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalCount: result.totalDocs,
    });
}));
exports.getAllMovies = getAllMovies;
// @route   GET /api/v1/movies/genre/:genre
// @desc    Get All Movies
// @access  Public
const getAllMoviesByGenre = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limit = 10 } = req.query;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;
    const movies = yield Movie_1.default.find({ genre: req.params.genre }).limit(limit);
    res.status(200).json({
        success: true,
        count: movies.length,
        data: movies,
    });
}));
exports.getAllMoviesByGenre = getAllMoviesByGenre;
// @route   GET /api/v1/movies/:id
// @desc    Get Single Movie
// @access  Public
const getMovie = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield Movie_1.default.findOne({ _id: req.params.movieId });
    if (!movie) {
        return next(new ErrorMessage_1.default(`No movie with the id ${req.params.movieId} was found`, 400));
    }
    res.json({ success: true, data: movie });
}));
exports.getMovie = getMovie;
// @route   POST /api/v1/movies/
// @desc    Create Movie
// @access  Public
const createMovie = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, description, genre } = req.body;
    if (!title || !description || !genre) {
        return next(new ErrorMessage_1.default(`Title, Genre and Description is required`, 400));
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
        const videoPosterUploadResult = yield s3
            .upload(moviePosterParams)
            .promise();
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
        subtitle: subtitleUrl,
    };
    const movie = yield Movie_1.default.create(movieData);
    res.status(200).json({ success: true, data: movie });
}));
exports.createMovie = createMovie;
// @route   GET /api/v1/movies/search?title='A title'
// @desc    Get Single Movies
// @access  Public
const searchMovie = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.query;
    const regexPattern = new RegExp(String(title), "i");
    const movie = yield Movie_1.default.find({ title: regexPattern });
    res.status(200).json({ success: true, data: movie });
}));
exports.searchMovie = searchMovie;
// @route   GET /api/v1/movies/comment/:movieId
// @desc    Add Comment to a Movie
// @access  Public
const addCommentToMovie = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const commentData = {
        comment: req.body.comment
    };
    const movie = yield Movie_1.default.findById({ _id: movieId });
    if (!movie) {
        return next(new ErrorMessage_1.default(`Movie with id ${movieId} not found`, 400));
    }
    movie.comments.unshift(commentData);
    const updatedMovie = yield movie.save();
    res.status(200).json({ success: true, data: updatedMovie });
}));
exports.addCommentToMovie = addCommentToMovie;
