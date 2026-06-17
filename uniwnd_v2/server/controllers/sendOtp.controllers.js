import { sendOtpEmail } from "../services/nodemailer.services.js";
import db from "../db/index.js";
import { generateOTP } from "../services/generateOtp.services.js";
import { hashOtp } from "../services/hashOtp.services.js";
import { verifyEmail } from "../utils/verifyEmail.utils.js";

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const error = verifyEmail(email);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        // Check opt exists ?
        const existingOtp = await db.query(
            "SELECT expires_at FROM unwind_otp WHERE email = $1",
            [email]
        );

        if (existingOtp.rows.length > 0) {
            const otpExpiresAt = new Date(existingOtp.rows[0].expires_at);
            const now = new Date();
            const timeLeft = Math.ceil((otpExpiresAt - now) / 1000);

            if (otpExpiresAt > now) {
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${timeLeft} seconds before requesting a new OTP`
                });
            }
        }

        // generate otp
        const Otp = await generateOTP();

        // check otp generated or not
        if (!Otp) {
            return res.status(400).json({
                success: false,
                message: "Error while generating OTP. Please try again"
            });
        }

        // hash otp
        const hashedOtp = await hashOtp(Otp);

        // check hashed otp
        if (!hashedOtp) {
            return res.status(400).json({
                success: false,
                message: "Error while generating OTP. Please try again"
            });
        }

        // generate otp expire time
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // save hashed otp in db
        const result = await db.query(
            `INSERT INTO unwind_otp (email, hashed_otp, expires_at, attempts_left) 
             VALUES ($1, $2, $3, 3)
             ON CONFLICT (email) 
             DO UPDATE SET hashed_otp = $2, expires_at = $3, attempts_left = 3`,
            [email, hashedOtp, expiresAt]
        );

        if (result.rowCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }

        // sent mail onto user's gmail account
        const mail = await sendOtpEmail(email, Otp);

        if (!mail) {
            return res.status(500).json({
                success: false,
                message: "Failed to send email",
            });
        }

        // send otp to user
        return res.status(200).json({
            success: true,
            email,
            message: `OTP sent successfully to ${email}`
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};