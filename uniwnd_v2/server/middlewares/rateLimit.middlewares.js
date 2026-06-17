import rateLimit from "express-rate-limit";

export const otpRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // 5 min mein sirf 3 baar request maar sakta hai
    message: {
        success: false,
        message: "Too many requests. Please try again after 5 minutes."
    }
});