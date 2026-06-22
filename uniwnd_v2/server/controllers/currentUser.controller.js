import db from "../db/index.js";

export const currentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        if(userId) {
            return res.status(500).json({
                success: false,
                message: "No user found."
            });
        }

        const user = await db.query("SELECT id, username, email, avatar_public_url from unwind_users where id = $1", [userId]);
    
    return res.status(200).json({
        message: "getting current user"
    });
    } catch (error) {
        
    }
};