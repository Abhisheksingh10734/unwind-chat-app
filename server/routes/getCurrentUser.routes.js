import { Router } from "express";
import { getCurrentUser } from "../controllers/getCurrentUser.controllers.js";

const router = Router();

router.post("/me", getCurrentUser);

export default router;