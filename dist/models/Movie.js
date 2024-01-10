"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MovieSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Movie Title is required"]
    },
    description: {
        type: String,
        required: [true, "Movie Description is required"]
    },
    videoUrl: String,
    subtitle: String,
    poster: String,
});
const Movie = (0, mongoose_1.model)("movie", MovieSchema);
exports.default = Movie;
