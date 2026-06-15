import jwt from "jsonwebtoken";

export const socketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("accessToken="))
        ?.split("=")[1];

      if (!token) {
        return next(new Error("Not logged in"));
      }

      const user = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });
};