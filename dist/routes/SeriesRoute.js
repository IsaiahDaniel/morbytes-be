"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SeriesController_1 = require("../controllers/SeriesController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.get("/", SeriesController_1.getAllSeries);
router.get("/search", SeriesController_1.searchSeries);
router.get("/genre/:genre", SeriesController_1.getAllSeriesByGenre);
router.get("/:seriesId", SeriesController_1.getSeries);
router.get("/bySeason/:seriesId", SeriesController_1.getSeriesBySeason);
router.post("/", multer_1.default.single("poster"), SeriesController_1.createSeries);
router.patch("/:seriesId", multer_1.default.fields([{ name: "video" }, { name: "subtitle" }]), SeriesController_1.updateSeries);
router.patch("/:seriesId/:seasonId", multer_1.default.fields([{ name: "video" }, { name: "subtitle" }]), SeriesController_1.updateSeasonEpisodes);
router.get("/:seriesId/:seasonId", SeriesController_1.updateSeasonEpisodes);
exports.default = router;
