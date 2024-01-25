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
exports.updateSeasonEpisodes = exports.getAllSeries = exports.getSeries = exports.updateSeries = exports.createSeries = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorMessage_1 = __importDefault(require("../messages/ErrorMessage"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const Series_1 = __importDefault(require("../models/Series"));
// @route   GET /api/v1/series
// @desc    Get All series
// @access  Private
const getAllSeries = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query;
    // GET /api/series?page=2&limit=5
    // const options = {
    //   page: parseInt(page, 10),
    //   limit: parseInt(limit, 10),
    // };
    const options = {
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
    };
    const result = yield Series_1.default.paginate({}, options);
    res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalCount: result.totalDocs,
    });
}));
exports.getAllSeries = getAllSeries;
// @route   GET /api/v1/series
// @desc    Get A serie
// @access  Private
const getSeries = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { seriesId } = req.params;
    const series = yield Series_1.default.findOne({ _id: seriesId });
    if (!series) {
        return next(new ErrorMessage_1.default(`No Series with the id ${req.params.seriesId} was found`, 400));
    }
    res.status(200).json({ success: true, data: series });
}));
exports.getSeries = getSeries;
// @route   GET /api/v1/series
// @desc    Create A series
// @access  Private
const createSeries = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { series_title, series_description } = req.body;
    if (!series_description || !series_title) {
        return next(new ErrorMessage_1.default(`Series Description and Series title is required`, 400));
    }
    if (!req.file) {
        return next(new ErrorMessage_1.default(`Please Upload a file`, 400));
    }
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    const file = req.file.originalname.split(".");
    const fileExt = file[file.length - 1];
    const posterParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `posters/${(0, uuid_1.v4)()}${Math.random()}.${fileExt}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    s3.upload(posterParams, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.log("error", error);
            return new ErrorMessage_1.default("File Upload Error", 500);
        }
        const seriesData = {
            series_title,
            series_description,
            series_poster: data.Location,
        };
        const series = yield Series_1.default.create(seriesData);
        res.status(201).json({ success: true, data: series });
    }));
}));
exports.createSeries = createSeries;
// @route   GET /api/v1/series
// @desc    Update A series
// @access  Private
const updateSeries = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { season_number, title } = req.body;
    if (!season_number || !title) {
        return next(new ErrorMessage_1.default(`Season Number and title is required`, 400));
    }
    if (((_a = (!req.files)) === null || _a === void 0 ? void 0 : _a.video) || (!req.files).subtitle) {
        return next(new ErrorMessage_1.default(`Please upload a video and subtitle`, 400));
    }
    if (req.files.subtitle[0].mimetype != "application/x-subrip") {
        return next(new ErrorMessage_1.default(`Only srt subtitle files (application/x-subrip) are allowed`, 400));
    }
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    let subtitleUrl, episodeUrl;
    const subtitlefile = (_b = req.files) === null || _b === void 0 ? void 0 : _b.subtitle[0].originalname.split(".");
    const videofile = (_c = req.files) === null || _c === void 0 ? void 0 : _c.video[0].originalname.split(".");
    const subtitlefileExt = subtitlefile[subtitlefile.length - 1];
    const videofileExt = videofile[videofile.length - 1];
    if (req.files.video) {
        const episodesParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `episodes/${(0, uuid_1.v4)()}${Math.random()}.${videofileExt}`,
            Body: req.files.video[0].buffer,
            ContentType: req.files.video[0].mimetype,
        };
        const videoUploadResult = yield s3.upload(episodesParams).promise();
        episodeUrl = videoUploadResult.Location;
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
    const { seriesId } = req.params;
    const series = yield Series_1.default.findOne({ _id: seriesId });
    const episodeData = {
        season_number,
        episodes: [{ title, movieUrl: episodeUrl, episode_subtitle: subtitleUrl }],
    };
    series === null || series === void 0 ? void 0 : series.seasons.unshift(episodeData);
    yield (series === null || series === void 0 ? void 0 : series.save());
    res.status(200).send({ success: true, data: series });
}));
exports.updateSeries = updateSeries;
// @route   GET /api/v1/series/:seriesId/:seasonId
// @desc    Add Episodes to a season
// @access  Private
const updateSeasonEpisodes = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h;
    const { title } = req.body;
    if (!title) {
        return next(new ErrorMessage_1.default(`Episode Title is required`, 400));
    }
    // if ((!req.files as any)?.video || (!req.files as any).subtitle) {
    if ((_d = (!req.files)) === null || _d === void 0 ? void 0 : _d.video) {
        return next(new ErrorMessage_1.default(`Please upload a video and subtitle`, 400));
    }
    if (req.files.subtitle) {
        if (req.files.subtitle[0].mimetype != "application/x-subrip") {
            return next(new ErrorMessage_1.default(`Only srt subtitle files (application/x-subrip) are allowed`, 400));
        }
    }
    const s3 = new aws_sdk_1.default.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    let subtitleUrl, episodeUrl;
    const subtitlefile = ((_e = req.files) === null || _e === void 0 ? void 0 : _e.subtitle) ? (_f = req.files) === null || _f === void 0 ? void 0 : _f.subtitle[0].originalname.split(".") : "";
    const subtitlefileExt = ((_g = req.files) === null || _g === void 0 ? void 0 : _g.subtitle) ? subtitlefile[subtitlefile.length - 1] : "";
    const videofile = (_h = req.files) === null || _h === void 0 ? void 0 : _h.video[0].originalname.split(".");
    const videofileExt = videofile[videofile.length - 1];
    if (req.files.video) {
        const episodesParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `episodes/${(0, uuid_1.v4)()}${Math.random()}.${videofileExt}`,
            Body: req.files.video[0].buffer,
            ContentType: req.files.video[0].mimetype,
        };
        const videoUploadResult = yield s3.upload(episodesParams).promise();
        episodeUrl = videoUploadResult.Location;
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
    const { seasonId, seriesId } = req.params;
    const series = yield Series_1.default.findOne({ _id: seriesId });
    const selectedSeason = series === null || series === void 0 ? void 0 : series.seasons.find((season) => season._id == seasonId);
    if (!selectedSeason) {
        return next(new ErrorMessage_1.default(`Could not find series`, 400));
    }
    const newEpisode = {
        title: title,
        movieUrl: episodeUrl,
        episode_subtitle: subtitleUrl,
    };
    selectedSeason.episodes.unshift(newEpisode);
    yield (series === null || series === void 0 ? void 0 : series.save());
    res.status(200).send({ success: true, data: series });
}));
exports.updateSeasonEpisodes = updateSeasonEpisodes;
