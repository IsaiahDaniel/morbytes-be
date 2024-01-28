import express from "express";
import { activateAccount, forgetPassword, loginUser, registerUser, resetPassword } from "../../controllers/AuthController";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify-email/:token", activateAccount);
router.post("/forgetPassword/", forgetPassword);
router.post("/passwordreset/:passwordToken", resetPassword);

export default router;