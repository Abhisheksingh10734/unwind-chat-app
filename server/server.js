import "dotenv/config";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// routes
import sendOtpRoute from "./routes/sendOtp.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Routes
app.use("/", sendOtpRoute);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});