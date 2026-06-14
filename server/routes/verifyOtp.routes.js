import { Router } from "express";
import { verifyOtp } from "../controllers/verifyOtp.controllers.js";

const router = Router();

router.post("/verify/otp", verifyOtp);

export default router;