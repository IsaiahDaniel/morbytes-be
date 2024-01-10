"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SupportController_1 = require("../controllers/SupportController");
const protect_1 = __importDefault(require("../middleware/protect"));
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.post("/", [protect_1.default, multer_1.default.single("ticket_image")], SupportController_1.createSupportTicket);
router.get("/", protect_1.default, SupportController_1.getSupportTickets);
router.get("/:id", protect_1.default, SupportController_1.getSupportTicket);
exports.default = router;
