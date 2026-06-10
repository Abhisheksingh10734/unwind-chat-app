import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("message", (msg) => {
    io.emit("message", (msg));
  });

  socket.on("disconnect", () => {
  console.log(socket.id, "disconnected");
});
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});