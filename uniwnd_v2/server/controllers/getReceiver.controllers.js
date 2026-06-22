import db from "../db/index.js";

export const getReceiver = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required."
            });
        }

        const receiverUser = await db.query(
            `SELECT id, username, avatar, is_online
             FROM unwind_users
             WHERE id = $1`,
            [id]
        );

        if (receiverUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            receiver: receiverUser.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};