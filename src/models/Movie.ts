import { Schema, model } from "mongoose";

const MovieSchema = new Schema({
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

const Movie = model("movie", MovieSchema);

export default Movie;