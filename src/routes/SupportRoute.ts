import express from "express";
import { createSupportTicket, getSupportTicket, getSupportTickets } from "../controllers/SupportController";
import protect from "../middleware/protect";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/", [ protect, upload.single("ticket_image") ], createSupportTicket);
router.get("/", protect, getSupportTickets);
router.get("/:id", protect, getSupportTicket);

export default router;