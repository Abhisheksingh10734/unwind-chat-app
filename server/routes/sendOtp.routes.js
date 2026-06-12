import { Router } from "express";
import { sendOtp } from "../controllers/sendOtp.controllers.js";

const router = Router();

router.post("/otp", sendOtp);

export default router;