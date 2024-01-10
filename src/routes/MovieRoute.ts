import express from "express";
import upload from "../middleware/multer";

import { createMovie, getAllMovies, getMovie } from "../controllers/MovieController";
import protect from "../middleware/protect";
          
const router = express.Router();

router.get("/", getAllMovies);
router.get("/:movieId", getMovie);
router.post("/", [upload.fields([{name: "poster"}, { name: "video" }, { name: "subtitle" }])], createMovie);


export default router;
