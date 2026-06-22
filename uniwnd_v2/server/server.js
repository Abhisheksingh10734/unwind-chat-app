import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import db from "./db/index.js";
import cookieParser from "cookie-parser";
import { globalRateLimit } from "../server/middlewares/rateLimit.middlewares.js";
import routes from "./routes/index.js";
import { initializeSocket } from "./sockets/index.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(globalRateLimit); 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// Initialize socket.io
initializeSocket(server);

app.use("/api", routes)

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