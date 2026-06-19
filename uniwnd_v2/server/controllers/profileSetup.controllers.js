import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";
import db from "../db/index.js";
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

    // ── 6. Check user exists in DB ────────────────────────────────────────────
    const existingUser = await db.query(
      "SELECT id FROM unwind_users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
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

    // ── 9. Update user in DB ──────────────────────────────────────────────────
    const updateResult = await db.query(
      `UPDATE unwind_users 
       SET username = $1,
           avatar = $2,
           avatar_public_id = $3
       WHERE email = $4`,
      [cleanUsername, avatarUrl, avatarPublicId, email.trim().toLowerCase()]
    );

    // ── 10. Check if update affected any rows ─────────────────────────────────
    if (updateResult.rowCount === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile. Try again.",
      });
    }

    // ── 11. Send success response ─────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Profile setup successfully!",
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