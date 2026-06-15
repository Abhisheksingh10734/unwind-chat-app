import "dotenv/config";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import db from "./db/index.db.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// routes
import sendOtpRoute from "./routes/sendOtp.routes.js";
import resendOtpRoute from "./routes/resendOtp.routes.js";
import verifyOtpRoute from "./routes/verifyOtp.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { socketAuth } from "./middlewares/socket.middleware.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// socket middleware
socketAuth(io);

const onlineUsers = new Map();

io.on("connection", (socket) => {

  onlineUsers.set(socket.user.email)

  socket.on("get-current-user", () => {
    socket.emit("connected-user", socket.user);
  });
  
  socket.on("disconnect", () => {
    onlineUsers.delete(socket.user._id)
  })
});

// Routes
app.use("/api", sendOtpRoute);
app.use("/api", resendOtpRoute);
app.use("/api", verifyOtpRoute);
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
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