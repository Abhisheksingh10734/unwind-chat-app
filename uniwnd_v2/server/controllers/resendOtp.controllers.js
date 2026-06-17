import db from "../db/index.js";
import { sendOtpEmail } from "../services/nodemailer.services.js";
import { generateOTP } from "../services/generateOtp.services.js";
import { hashOtp } from "../services/hashOtp.services.js";
import { verifyEmail } from "../utils/verifyEmail.utils.js";

export const resendOtp = async (req, res) => {
    try {
        // get email from user
        const { email } = req.body;

        // throw error if email missing
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // check for valid email
        const error = verifyEmail(email);

        // throw error if email format is not valid
        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // check if OTP record exists
        const existingOtp = await db.query(
            "SELECT expires_at FROM unwind_otp WHERE email = $1",
            [email]
        );

        // throw error if no OTP record found
        if (existingOtp.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No OTP request found for this email. Please request a new OTP"
            });
        }

        // rate limit check — if OTP is still active
        const otpExpiresAt = new Date(existingOtp.rows[0].expires_at);
        const now = new Date();
        const timeLeft = Math.ceil((otpExpiresAt - now) / 1000);

        if (otpExpiresAt > now) {
            return res.status(429).json({
                success: false,
                message: `Please wait ${timeLeft} seconds before requesting a new OTP`
            });
        }

        // generate otp
        const Otp = await generateOTP();

        // throw error if otp generation failed
        if (!Otp) {
            return res.status(400).json({
                success: false,
                message: "Error while generating OTP. Please try again"
            });
        }

        // hash otp using bcrypt
        const hashedOtp = await hashOtp(Otp);

        // throw error if hashing failed
        if (!hashedOtp) {
            return res.status(400).json({
                success: false,
                message: "Error while generating OTP. Please try again"
            });
        }

        // generate otp expiry time
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // insert email, hashedotp, expiryTime into db
        const result = await db.query(
            `UPDATE unwind_otp 
             SET hashed_otp = $1, expires_at = $2, attempts_left = 3 
             WHERE email = $3`,
            [hashedOtp, expiresAt, email]
        );

        // throw error if insertion failed
        if (result.rowCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }

        // send new otp to user's email
        const mail = await sendOtpEmail(email, Otp);

        if (!mail) {
            return res.status(500).json({
                success: false,
                message: "Failed to send email"
            });
        }

        // return success response
        return res.status(200).json({
            success: true,
            email,
            message: `OTP resent successfully to ${email}`
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};