import express from "express";
import {
  createSeries,
  getAllSeries,
  updateSeries,
  getSeries,
  updateSeasonEpisodes,
  searchSeries,
  getSeriesBySeason,
  getAllSeriesByGenre
} from "../controllers/SeriesController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/", getAllSeries);
router.get("/search", searchSeries);
router.get("/genre/:genre", getAllSeriesByGenre);
router.get("/:seriesId", getSeries);
router.get("/bySeason/:seriesId", getSeriesBySeason);


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

router.get(
  "/:seriesId/:seasonId",
  updateSeasonEpisodes
);

export default router;
