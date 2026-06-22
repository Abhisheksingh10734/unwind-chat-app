import db from "../db/index.js";

export const receiveMessage = async (req, res) => {
    try {
        const { to, text } = req.body;
        const from = req.user.id;

        if (!to || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Receiver id and message text are required"
            });
        }

        const result = await db.query(
            `
            INSERT INTO unwind_messages (
                sender_id,
                receiver_id,
                text
            )
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                Number(from),
                Number(to),
                text.trim()
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};