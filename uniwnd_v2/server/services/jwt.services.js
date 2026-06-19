import jwt from "jsonwebtoken";

const generateAccessToken = (id, email) =>
    jwt.sign(
        { id, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

const generateRefreshToken = (id) =>
    jwt.sign(
        { id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    export {generateAccessToken, generateRefreshToken}