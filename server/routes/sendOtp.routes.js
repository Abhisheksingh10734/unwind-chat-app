import { Router } from "express";
import { sendOtp } from "../controllers/sendOtp.controllers.js";

const router = Router();

router.post("/otp/sent", sendOtp);

export default router;