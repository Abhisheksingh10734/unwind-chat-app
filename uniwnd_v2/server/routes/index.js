import express from "express";
import { otpRateLimit } from "../middlewares/rateLimit.middlewares.js";
import { sendOtp } from "../controllers/sendOtp.controllers.js";
import { verifyOtp } from "../controllers/verifyOtp.controllers.js";
import { resendOtp } from "../controllers/resendOtp.controllers.js";
import { loginUser } from "../controllers/login.controllers.js";
import { profileSetup } from "../controllers/profileSetup.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { currentUser } from "../controllers/currentUser.controller.js";
import { auth } from "../middlewares/auth.middlerwares.js";
import { getAllUsers } from "../controllers/getAllUsers.controllers.js";
import { getReceiver } from "../controllers/getReceiver.controllers.js";
import { receiveMessage } from "../controllers/receiveMessage.controllers.js";
import { getMessages } from "../controllers/message.controllers.js";
// import { logout } from "../controllers/logout.controllers.js";

const router = express.Router();

router.post("/auth/send-otp", otpRateLimit, sendOtp);
router.post("/auth/verify-otp", otpRateLimit, verifyOtp);
router.post("/auth/resend-otp", otpRateLimit, resendOtp);
// router.post("/auth/login", otpRateLimit, loginUser);
// router.post("/auth/logout", logout);
router.post("/auth/profile/setup",  upload.single("avatar"), profileSetup);
router.get("/auth/me", auth, currentUser);
router.get("/auth/get-users", auth, getAllUsers);
router.get("/auth/chats/:id", getReceiver);
router.post("/auth/send-message", auth, receiveMessage);
router.get("/auth/messages/:receiverId", auth, getMessages);

export default router;