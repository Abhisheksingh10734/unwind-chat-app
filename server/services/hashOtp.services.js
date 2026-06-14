import bcrypt from "bcrypt";

const hashOtp = async (otp) => {
    return await bcrypt.hash(otp, 12);
}

const compareOtp = async (userOtp, hashOtp) => {
    return bcrypt.compare(userOtp, hashOtp);
}

export { hashOtp, compareOtp };