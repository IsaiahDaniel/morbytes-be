"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const SongSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "Song type is required"],
        enum: ["single", "album"],
    },
    title: {
        type: String,
        required: [true, "Song Title is required"],
    },
    genre: {
        type: String,
        required: [true, "Song Genre is required"],
    },
    songUrl: {
        type: String,
    },
    image: {
        type: String,
        required: [true, "Image Thumbnail is required"],
    },
});
SongSchema.plugin(mongoose_paginate_v2_1.default);
const Song = (0, mongoose_1.model)("song", SongSchema);
exports.default = Song;
