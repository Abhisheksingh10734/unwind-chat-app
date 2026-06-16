import "dotenv/config";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import db from "./db/index.db.js";
import cookieParser from "cookie-parser";

// routes
import sendOtpRoute from "./routes/sendOtp.routes.js";
import resendOtpRoute from "./routes/resendOtp.routes.js";
import verifyOtpRoute from "./routes/verifyOtp.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { socketAuth } from "./middlewares/socket.middleware.js";
import { getAllUsers } from "./utils/fetchAllUsers.utils.js";
import getChatID from "./routes/renderChat.routes.js";
import getCurrentUser from "./routes/getCurrentUser.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

socketAuth(io);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("get-all-users", async () => {
    const users = await getAllUsers();
    socket.emit("all-users", users);
  });

  socket.on("join", (userId) => {
    onlineUsers.delete(String(userId));
    onlineUsers.set(String(userId), socket.id);
  });

  socket.on("leave", (userId) => {
    onlineUsers.delete(String(userId));
  });

  socket.on("private-message", (data) => {
    const receiverSocketId = onlineUsers.get(String(data.receiverId));

    if (receiverSocketId) {
      const receiverSocket = io.sockets.sockets.get(receiverSocketId);
      if (receiverSocket) {
        receiverSocket.emit("receive-message", data);
      }
    }

    if (String(data.senderId) !== String(data.receiverId)) {
      socket.emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Routes
app.use("/api", sendOtpRoute);
app.use("/api", resendOtpRoute);
app.use("/api", verifyOtpRoute);
app.use("/auth", authRoutes);
app.use("/api", getChatID);
app.use("/api", getCurrentUser);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

db.connect()
  .then(() => {
    console.log("DB connected successfully.");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });