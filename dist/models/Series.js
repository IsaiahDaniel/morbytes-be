"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const episodeSchema = new mongoose_1.Schema({
    title: String,
    movieUrl: String,
    episode_subtitle: String,
});
const seriesSchema = new mongoose_1.Schema({
    series_title: {
        type: String,
        required: [true, "Series Title is required"],
    },
    series_description: {
        type: String,
        required: [true, "Series Description is required"],
    },
    seasons: [
        {
            season_number: {
                type: String,
                required: [true, "Season Number is required"],
                unique: [true, "Every Season Must be unqiue"]
            },
            episodes: [episodeSchema],
        },
    ],
    series_poster: {
        type: String,
        // required: [true, "series Poster is required"],
    },
});
seriesSchema.plugin(mongoose_paginate_v2_1.default);
// const Series = model("series", seriesSchema);
const Series = (0, mongoose_1.model)("series", seriesSchema);
exports.default = Series;
