import db from "../db/index.js";

export const currentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        if(!userId) {
            return res.status(500).json({
                success: false,
                message: "No user found."
            });
        }

        const user = await db.query("SELECT id, username, email, avatar from unwind_users where id = $1", [userId]);

        if(user.rowCount === 0) {
            return res.status(500).json({
                success: false,
                message: "No user found."
            });
        }

        const currentUserId = user.rows[0].id;
        const currentUserEmail = user.rows[0].email;
        const currentUserAvatar = user.rows[0].avatar;
        const currentUserUsername = user.rows[0].username;
        
        
    
    return res.status(200).json({
        success: true,
        currentUserId,
        currentUserUsername,
        currentUserEmail,
        currentUserAvatar,
        message: "User fetched successfully."
    });
    } catch (error) {
        
    }
};