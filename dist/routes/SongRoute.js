"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SongController_1 = require("../controllers/SongController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.get("/", SongController_1.getSongs);
router.post("/", multer_1.default.fields([{ name: "audio" }, { name: "image" }]), SongController_1.createSong);
router.get("/:id", SongController_1.getSong);
router.patch("/:id", SongController_1.updateSong);
router.delete("/:id", SongController_1.getSong);
exports.default = router;
