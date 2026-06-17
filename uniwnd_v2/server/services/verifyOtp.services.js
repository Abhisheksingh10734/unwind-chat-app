import bcrypt from "bcrypt";

export const compareOtp = async (userOtp, hashOtp) => {
    return bcrypt.compare(userOtp, hashOtp);
}