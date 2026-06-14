import db from "../db/index.db.js";
import { generateOTP } from "../services/generateOtp.service.js";
import { hashOtp } from "../services/hashOtp.services.js";
import { sendOtpEmail } from "../services/email.service.js";

const resendOtp = async (req, res) => {
  try {
    const MAX_RESENDS = Number(process.env.MAX_RESENDS || 3);

    const { email } = req.body;

    const result = await db.query(
      `
      SELECT resend_count
      FROM unwind_otp
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "OTP record not found",
      });
    }

    const resendCount = result.rows[0].resend_count;

    if (resendCount >= MAX_RESENDS) {
      return res.status(403).json({
        success: false,
        message: "Maximum resend limit reached",
      });
    }

    const otp = generateOTP();

    const otpHash = await hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      `
      UPDATE unwind_otp
      SET
        otp_hash = $1,
        expires_at = $2,
        resend_count = resend_count + 1
      WHERE email = $3
      `,
      [otpHash, expiresAt, email]
    );

    const mailSent = await sendOtpEmail(email, otp);

    if (!mailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    return res.status(200).json({
      success: true,
      email,
      resendsLeft: MAX_RESENDS - (resendCount + 1),
      message: "OTP resent successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export default resendOtp;