import { sendOtpEmail } from "../services/email.service.js";
import { generateOTP } from "../services/generateOtp.service.js";

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = await generateOTP();

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Error while generating otp"
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