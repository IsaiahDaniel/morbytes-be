import express from "express";
import { getSongs, getSong, updateSong, createSong } from "../controllers/SongController";
import upload from "../middleware/multer";

const router = express.Router();

router.get("/", getSongs);
router.post("/", upload.fields([{ name: "audio" }, { name: "image" }]), createSong);
router.get("/:id", getSong);
router.patch("/:id", updateSong);
router.delete("/:id", getSong);

export default router;