import db from "../db/index.db.js";
import { sendOtpEmail } from "../services/email.service.js";
import { generateOTP } from "../services/generateOtp.service.js";
import { hashOtp } from "../services/hashOtp.services.js";
import { verifyEmail } from "../utils/verifyEmail.utils.js";

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const error = verifyEmail(email);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error
            });
        }

        const existingEmail = await db.query(
            "SELECT email FROM unwind_otp WHERE email = $1",
            [email]
        );

        if (existingEmail.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists. Try logging in..."
            });
        }

        const otp = await generateOTP();

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Error while generating otp"
            });
        }

        const otpHash = await hashOtp(otp);

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const result = await db.query("insert into unwind_otp (email, otp_hash, expires_at, attempts, resend_count) values ($1, $2, $3, 0, 0)", [email, otpHash, expiresAt]);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }

        const mail = await sendOtpEmail(email, otp);

        if (!mail) {
            return res.status(500).json({
                success: false,
                message: "Failed to send email",
            });
        }

        return res.status(200).json({
            success: true,
            email,
            message: "Mail sent successfully",
        });
    } catch (error) {
        console.error(error);
        console.log(error.response);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}