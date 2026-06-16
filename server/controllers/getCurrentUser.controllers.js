import db from "../db/index.db.js";

export const getCurrentUser = async (req, res) => {
    const {email} = req.body;

    const result = await db.query("select id from unwind_users where email = $1", [email]);

    return res.status(200).json({
        success: true,
        data: result.rows[0]
    });
}