import db from "../db/index.js";

export const getAllUsers = async (req, res) => {
    const getAllUsers = await db.query("SELECT id, username, email, avatar, is_online, last_seen FROM unwind_users");

    if(getAllUsers.rowCount === 0) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching the user."
        });
    }

    const users = getAllUsers.rows;

    return res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        users
    });
};