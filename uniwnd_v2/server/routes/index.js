import express from "express";
import { otpRateLimit } from "../middlewares/rateLimit.middlewares.js";
import { sendOtp } from "../controllers/sendOtp.controllers.js";
import { verifyOtp } from "../controllers/verifyOtp.controllers.js";
import { resendOtp } from "../controllers/resendOtp.controllers.js";
import { loginUser } from "../controllers/login.controllers.js";
// import { profileSetup } from "../controllers/profileSetup.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
// import { logout } from "../controllers/logout.controllers.js";

const router = express.Router();

router.post("/auth/send-otp", otpRateLimit, sendOtp);
router.post("/auth/verify-otp", otpRateLimit, verifyOtp);
router.post("/auth/resend-otp", otpRateLimit, resendOtp);
// router.post("/auth/login", otpRateLimit, loginUser);
// router.post("/auth/logout", logout);
// router.post("/auth/profile/setup", otpRateLimit, upload.single("avatar"), profileSetup);

export default router;