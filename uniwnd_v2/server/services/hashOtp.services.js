import bcrypt from "bcrypt";

export const hashOtp = async (otp) => {
    return await bcrypt.hash(otp, 12);
};