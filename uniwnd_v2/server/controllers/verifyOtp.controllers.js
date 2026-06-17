import db from "../db/index.js";
import { compareOtp } from "../services/compareOtp.services.js";

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
            // delete expired otp from db
            await db.query("DELETE FROM unwind_otp WHERE email = $1", [email]);

            return res.status(400).json({
                success: false,
                message: "OTP expired. Request a new OTP"
            });
        }

        // check for the attempt max 3 allowed
        if (attempts_left <= 0) {
            // delete otp from db
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
            // decrement attempts_left
            await db.query(
                "UPDATE unwind_otp SET attempts_left = attempts_left - 1 WHERE email = $1",
                [email]
            );

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${attempts_left - 1} attempts left`
            });
        }

        // delete user data from unwind_otp after verification
        await db.query("DELETE FROM unwind_otp WHERE email = $1", [email]);

        // send success response
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