import cloudinary from "../config/cloudinary.config.js";
import db from "../db/index.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.services.js";
import { verifyEmail } from "../utils/verifyEmail.utils.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

const capitalizeWords = (str) => {
  return str
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// ─── Controller ─────────────────────────────────────────────────────────────

export const profileSetup = async (req, res) => {
  try {
    const { avatar, username, email } = req.body;

    // missing check
    if (!avatar || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "Avatar, username and email are required.",
      });
    }

    // ── 3. Username trim + capitalize ─────────────────────────────────────────
    const cleanUsername = capitalizeWords(username);

    // ── 4. Email format validate ──────────────────────────────────────────────
    const error = verifyEmail(email);
    
    if(error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }

    // ── 5. Username length check ──────────────────────────────────────────────
    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Username must between 2 to 30 characters.",
      });
    }

    // ── 6. Username already exists? ───────────────────────────────────────────
    const existingUser = await db.query(
      "SELECT id FROM unwind_users WHERE username = $1 OR email = $2",
      [cleanUsername, email.trim().toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ye username ya email pehle se exist karta hai.",
      });
    }

    // ── 7. Cloudinary image upload ─────────────────────────────────────────
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(avatar, {
        folder: "unwind/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Avatar upload failed. Try again.",
      });
    }

    // ── 8. Upload success verify ──────────────────────────────────────────────
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({
        success: false,
        message: "No response from avatar upload.",
      });
    }

    const avatarUrl = uploadResult.secure_url;
    const avatarPublicId = uploadResult.public_id;

    // ── 9. Insert user into DB ───────────────────────────────────────────
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
        false,
        false,
        null,
      ]
    );

    const newUser = insertResult.rows[0];

    // ── 10. generate tokens ──────────────────────────────────────────────
    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const refreshToken = generateRefreshToken(newUser.id, newUser.email);

    // ── 11. Refresh token DB mein save karo ───────────────────────────────────
    await db.query(
      "UPDATE unwind_users SET refresh_token = $1 WHERE id = $2",
      [refreshToken, newUser.id]
    );

    // ── 12. Cookie options ────────────────────────────────────────────────────
    const cookieOptions = {
      httpOnly: true,   // not access with JS — XSS safe
      secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
      sameSite: "strict",
    };

    // ── 13. Response bhejo ────────────────────────────────────────────────────
    return res
      .status(201)
      .cookie("accessToken", cookieOptions, accessToken)
      .cookie("refreshToken", cookieOptions, refreshToken)
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
        accessToken,
      });

  } catch (error) {
    console.error("profileSetup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Try again",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};