import db from "../db/index.db.js";

export const getAllUsers = async () => {
    const result = await db.query(
        "SELECT * FROM unwind_users"
    );

    return result.rows;
};