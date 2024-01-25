"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArtistSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, ""]
    },
    image: {
        type: String
    }
});
const Artist = (0, mongoose_1.model)("artist", ArtistSchema);
