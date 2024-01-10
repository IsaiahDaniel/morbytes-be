"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const router = express_1.default.Router();
router.post("/login", AuthController_1.loginUser);
router.post("/register", AuthController_1.registerUser);
router.get("/verify-email/:token", AuthController_1.activateAccount);
router.post("/forgetPassword/", AuthController_1.forgetPassword);
router.post("/passwordreset/:passwordToken", AuthController_1.resetPassword);
exports.default = router;
