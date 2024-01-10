import express from "express";
import {
  createSeries,
  getAllSeries,
  updateSeries,
  getSeries,
  updateSeasonEpisodes,
} from "../controllers/SeriesController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/", getAllSeries);
router.get("/:seriesId", getSeries);
router.post("/", upload.single("poster"), createSeries);
router.patch(
  "/:seriesId",
  upload.fields([{ name: "video" }, { name: "subtitle" }]),
  updateSeries
);
router.patch(
  "/:seriesId/:seasonId",
  upload.fields([{ name: "video" }, { name: "subtitle" }]),
  updateSeasonEpisodes
);

export default router;
