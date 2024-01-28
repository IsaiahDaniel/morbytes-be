"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../middleware/multer"));
const MovieController_1 = require("../controllers/MovieController");
const router = express_1.default.Router();
router.get("/", MovieController_1.getAllMovies);
router.get("/search", MovieController_1.searchMovie);
router.get("/genre/:genre", MovieController_1.getAllMoviesByGenre);
router.get("/:movieId", MovieController_1.getMovie);
router.post("/", [multer_1.default.fields([{ name: "poster" }, { name: "video" }, { name: "subtitle" }])], MovieController_1.createMovie);
router.patch("/comment/:movieId", MovieController_1.addCommentToMovie);
exports.default = router;
