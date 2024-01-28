import express from "express";
import upload from "../middleware/multer";

import { addCommentToMovie, createMovie, getAllMovies, getMovie, searchMovie, getAllMoviesByGenre } from "../controllers/MovieController";
import protect from "../middleware/protect";
          
const router = express.Router();

router.get("/", getAllMovies);
router.get("/search", searchMovie);
router.get("/genre/:genre", getAllMoviesByGenre);
router.get("/:movieId", getMovie);
router.post("/", [upload.fields([{name: "poster"}, { name: "video" }, { name: "subtitle" }])], createMovie);
router.patch("/comment/:movieId", addCommentToMovie)

export default router;
