import db from "../db/index.db.js";
import { compareOtp } from "../services/hashOtp.services.js";
import {
    generateAccessToken,
    generateRefreshToken
} from "../services/jwt.services.js";

export const verifyOtp = async (req, res) => {
    try {
        const { email, userOtp } = req.body;

        if (!email || !userOtp) {
            return res.status(400).json({
                success: false,
                message: "Email or OTP missing."
            });
        }

        if (!Array.isArray(userOtp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP format."
            });
        }

        const otp = userOtp.join("");

        if (otp.length !== 6) {
            return res.status(400).json({
                success: false,
                message: "OTP must be 6 digits."
            });
        }

        const otpResult = await db.query(
            `
            SELECT *
            FROM unwind_otp
            WHERE email = $1
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [email]
        );

        if (otpResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "OTP record not found."
            });
        }

        const otpRecord = otpResult.rows[0];

        const isExpired =
            Date.now() >
            new Date(otpRecord.expires_at).getTime();

        if (isExpired) {
            await db.query(
                "DELETE FROM unwind_otp WHERE email = $1",
                [email]
            );

            return res.status(403).json({
                success: false,
                message: "OTP expired."
            });
        }

        const isOtpValid = await compareOtp(
            otp,
            otpRecord.otp_hash
        );

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        const accessToken = await generateAccessToken(email);
        const refreshToken = await generateRefreshToken(email);

        if (!accessToken || !refreshToken) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate tokens."
            });
        }

        await db.query("BEGIN");

        try {
            await db.query(
                `
                INSERT INTO unwind_users (
                    email,
                    refresh_token,
                    is_verified
                )
                VALUES ($1, $2, TRUE)

                ON CONFLICT (email)
                DO UPDATE
                SET
                    refresh_token = EXCLUDED.refresh_token,
                    is_verified = TRUE
                `,
                [email, refreshToken]
            );

            await db.query(
                `
                DELETE FROM unwind_otp
                WHERE email = $1
                `,
                [email]
            );

            await db.query("COMMIT");
        } catch (error) {
            await db.query("ROLLBACK");
            throw error;
        }

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 min
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                accessTokenOptions
            )
            .cookie(
                "refreshToken",
                refreshToken,
                refreshTokenOptions
            )
            .json({
                success: true,
                message: "OTP verified successfully."
            });

    } catch (error) {
        console.error(
            "OTP Verification Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};