"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const commentSchema = new mongoose_1.Schema({
    comment: String
});
const MovieSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Movie Title is required"],
    },
    description: {
        type: String,
        required: [true, "Movie Description is required"],
    },
    genre: {
        type: String,
        required: [true, "Movie Genre is required"],
    },
    comments: [commentSchema],
    videoUrl: String,
    subtitle: String,
    poster: String,
});
MovieSchema.plugin(mongoose_paginate_v2_1.default);
const Movie = (0, mongoose_1.model)("movie", MovieSchema);
exports.default = Movie;
