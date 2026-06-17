import express from "express";
import { otpRateLimit } from "../middlewares/rateLimit.middlewares.js";
import { sendOtp } from "../controllers/sendOtp.controllers.js";
import { verifyOtp } from "../controllers/verifyOtp.controllers.js";
import { resendOtp } from "../controllers/resendOtp.controllers.js";

const router = express.Router();

router.post("/auth/send-otp", otpRateLimit, sendOtp);
router.post("/auth/verify-otp", otpRateLimit, verifyOtp);
router.post("/auth/resend-otp", otpRateLimit, resendOtp);

export default router;