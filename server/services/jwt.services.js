import jwt from "jsonwebtoken";

const generateAccessToken = (email) =>
    jwt.sign(
        { email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

const generateRefreshToken = (email) =>
    jwt.sign(
        { email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    export {generateAccessToken, generateRefreshToken}