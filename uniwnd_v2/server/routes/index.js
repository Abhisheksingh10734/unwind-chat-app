import express from "express";
import { sendOtp } from "../controllers/sendOtp.controllers.js";
import { otpRateLimit } from "../middlewares/rateLimit.middlewares.js";

const router = express.Router();

router.post("/auth/send-otp", otpRateLimit, sendOtp);

export default router;