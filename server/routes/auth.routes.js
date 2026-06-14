import express from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/me",
    verifyAccessToken,
    (req, res) => {

        res.status(200).json({
            success: true,
            user: req.user
        });

    }
);

export default router;