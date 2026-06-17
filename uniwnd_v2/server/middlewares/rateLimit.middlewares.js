import rateLimit from "express-rate-limit";

export const otpRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // 5 min mein sirf 3 baar request maar sakta hai
    message: {
        success: false,
        message: "Too many requests. Please try again after 5 minutes."
    }
});

// Global rate limit — poori app ke liye
export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // 100 requests per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});