import db from "../db/index.js";
import { compareOtp } from "../services/compareOtp.services.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.services.js";

export const verifyOtp = async (req, res) => {
    try {
        // get otp and email from user
        const { userOtp, email } = req.body;

        // check existence of otp and email
        if (!userOtp || !email) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // convert userOtp into number
        const UserValidOtp = Number(userOtp);

        // get the hashedOtp from the db
        const otpRecord = await db.query(
            "SELECT * FROM unwind_otp WHERE email = $1",
            [email]
        );

        // check for existence of hashedOtp
        if (otpRecord.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "OTP not found. Request a new OTP"
            });
        }

        const { hashed_otp, expires_at, attempts_left } = otpRecord.rows[0];

        // check for expiry
        const now = new Date();
        const otpExpiresAt = new Date(expires_at);

        // if expires then throw error
        if (otpExpiresAt < now) {
            await db.query("DELETE FROM unwind_otp WHERE email = $1", [email]);

            return res.status(400).json({
                success: false,
                message: "OTP expired. Request a new OTP"
            });
        }

        // check for the attempt max 3 allowed
        if (attempts_left <= 0) {
            await db.query("DELETE FROM unwind_otp WHERE email = $1", [email]);

            return res.status(403).json({
                success: false,
                message: "Too many attempts. Request a new OTP"
            });
        }

        // compare Otp
        const isMatch = await compareOtp(String(UserValidOtp), String(hashed_otp));

        // check is Otp valid
        if (!isMatch) {
            await db.query(
                "UPDATE unwind_otp SET attempts_left = attempts_left - 1 WHERE email = $1",
                [email]
            );

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${attempts_left - 1} attempts left`
            });
        }

        // ✅ FIX: Check if user already exists with this email
        const existingUser = await db.query(
            "SELECT id, email FROM unwind_users WHERE email = $1",
            [email]
        );

        let userId, userEmail;

        if (existingUser.rows.length > 0) {
            // User already registered — reuse existing record
            userId = existingUser.rows[0].id;
            userEmail = existingUser.rows[0].email;
        } else {
            // New user — register into db
            const registerUser = await db.query(
                "INSERT INTO unwind_users (username, email, avatar, is_verified, is_online, last_seen, refresh_token) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email",
                [null, email, null, true, false, null, null]
            );

            if (registerUser.rowCount === 0) {
                return res.status(500).json({
                    success: false,
                    message: "Error while registering the user"
                });
            }

            userId = registerUser.rows[0].id;
            userEmail = registerUser.rows[0].email;
        }

        // delete user data from unwind_otp after verification
        await db.query("DELETE FROM unwind_otp WHERE email = $1", [email]);

        // generate tokens
        const accessToken = generateAccessToken(userId, userEmail);
        const refreshToken = generateRefreshToken(userId);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        // Save refresh token to DB
        await db.query(
            "UPDATE unwind_users SET refresh_token = $1 WHERE id = $2",
            [refreshToken, userId]
        );

        // set cookies
        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json({
            success: true,
            email,
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};