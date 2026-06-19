import db from "../db/index.js";

export const logout = async (req, res) => {
    try {
        // clear access token cookie
        res.clearCookie('accessToken');

        // clear refresh token cookie
        res.clearCookie('refreshToken');

        // remove refresh token from db
        // const { userId } = req.user;

        console.log(req.user);
        

        // await db.query(
        //     "UPDATE unwind_users SET refresh_token = NULL WHERE id = $1",
        //     [userId]
        // );

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};