import db from "../db/index.db.js";

export const renderChat = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        const result = await db.query(
            "SELECT id, email, fullname, status FROM unwind_users WHERE id = $1",
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("renderChat error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};