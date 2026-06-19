import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";
import db from "../db/index.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.services.js";
import { verifyEmail } from "../utils/verifyEmail.utils.js";

// ─── Helper: Capitalize each word of a string ───────────────────────────────
const capitalizeWords = (str) => {
  return str
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// ─── Helper: Upload image buffer to Cloudinary via stream ───────────────────
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "unwind/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    // pipe the file buffer into cloudinary upload stream
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ─── Controller: profileSetup ────────────────────────────────────────────────
export const profileSetup = async (req, res) => {
  try {
    const { username, email } = req.body;

    // ── 1. Check if file was attached by multer ───────────────────────────────
    const avatarFile = req.file;

    // ── 2. Missing fields check ───────────────────────────────────────────────
    if (!avatarFile || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "Avatar file, username and email are required.",
      });
    }

    // ── 3. Trim and capitalize each word of username ──────────────────────────
    const cleanUsername = capitalizeWords(username);

    // ── 4. Validate email format via utility ──────────────────────────────────
    const emailError = verifyEmail(email);
    if (emailError) {
      return res.status(400).json({
        success: false,
        message: emailError,
      });
    }

    // ── 5. Username length check (2–30 characters) ────────────────────────────
    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 2 to 30 characters.",
      });
    }

    // ── 6. Check for duplicate username or email in DB ────────────────────────
    const existingUser = await db.query(
      "SELECT id FROM unwind_users WHERE username = $1 OR email = $2",
      [cleanUsername, email.trim().toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This username or email already exists.",
      });
    }

    // ── 7. Upload avatar buffer to Cloudinary ─────────────────────────────────
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(avatarFile.buffer);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Avatar upload failed. Try again.",
      });
    }

    // ── 8. Verify Cloudinary returned a valid URL ─────────────────────────────
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({
        success: false,
        message: "No response from avatar upload.",
      });
    }

    const avatarUrl = uploadResult.secure_url;
    const avatarPublicId = uploadResult.public_id;

    // ── 9. Insert new user into DB ────────────────────────────────────────────
    const insertResult = await db.query(
      `INSERT INTO unwind_users 
        (username, email, avatar, avatar_public_id, is_verified, is_online, refresh_token) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username, email, avatar, is_verified, is_online, created_at`,
      [
        cleanUsername,
        email.trim().toLowerCase(),
        avatarUrl,
        avatarPublicId,
        true,
        false,
        null,  // refresh_token — will be updated below
      ]
    );

    const newUser = insertResult.rows[0];

    // ── 10. Generate access and refresh tokens ────────────────────────────────
    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const refreshToken = generateRefreshToken(newUser.id, newUser.email);

    // ── 11. Save refresh token in DB ──────────────────────────────────────────
    await db.query(
      "UPDATE unwind_users SET refresh_token = $1 WHERE id = $2",
      [refreshToken, newUser.id]
    );

    // ── 12. Cookie options ────────────────────────────────────────────────────
    const cookieOptions = {
      httpOnly: true,                                    // not accessible via JS — XSS safe
      secure: process.env.NODE_ENV === "production",    // HTTPS only in production
      sameSite: "strict",                               // CSRF protection
    };

    const accessTokenOptions = {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,           // 15 minutes
    };

    const refreshTokenOptions = {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // setting user into the req
    req.user = newUser;

    // ── 13. Send response with cookies ────────────────────────────────────────
    return res
      .status(201)
      .cookie("accessToken", accessToken, accessTokenOptions)    // ✅ (name, value, options)
      .cookie("refreshToken", refreshToken, refreshTokenOptions) // ✅ (name, value, options)
      .json({
        success: true,
        message: "Profile setup successfully!",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          is_verified: newUser.is_verified,
          is_online: newUser.is_online,
          created_at: newUser.created_at,
        },
        accessToken, // also sent in body for clients that can't read cookies (e.g. mobile)
      });

  } catch (error) {
    console.error("profileSetup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Try again.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};