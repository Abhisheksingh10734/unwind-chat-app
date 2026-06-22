import jwt from "jsonwebtoken";
import db from "../db/index.js";

export const auth = async (req, res, next) => {
    try {
        const token =
            req.headers.authorization?.split(" ")[1] ||
            req.cookies.accessToken ||
            req.body.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await db.query(
            "SELECT id FROM unwind_users WHERE id = $1",
            [decoded.id]
        );

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user.rows[0];

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};