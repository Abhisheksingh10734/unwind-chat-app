import { transporter } from "../config/nodemailer.config.js";

export const sendOtpEmail = async (email, otp) => {
    try {
        return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        html: `
            <h2>Your OTP</h2>
            <h1>${otp}</h1>
            <p>Valid for 5 minutes.</p>
            <p>Don't share your otp with anyone.</p>
        `,
    });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while sending email."
        })
    }
};