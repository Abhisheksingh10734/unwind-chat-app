import { Router } from "express";
import resendOtp from "../controllers/resendOtp.controllers.js";

const router = Router();

router.post("/otp/resent", resendOtp);

export default router;