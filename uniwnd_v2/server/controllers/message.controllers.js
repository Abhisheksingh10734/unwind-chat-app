import db from "../db/index.js";

export const getMessages = async (
    req,
    res
) => {
    try {
        const senderId = req.user.id;
        const receiverId = Number(
            req.params.receiverId
        );

        const result = await db.query(
            `
            SELECT *
            FROM unwind_messages
            WHERE
            (
                sender_id = $1
                AND receiver_id = $2
            )
            OR
            (
                sender_id = $2
                AND receiver_id = $1
            )
            ORDER BY created_at ASC
            `,
            [senderId, receiverId]
        );

        return res.status(200).json({
            success: true,
            messages: result.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};