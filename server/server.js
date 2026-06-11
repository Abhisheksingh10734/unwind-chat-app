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

const users = new Map();

io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    console.log("JOIN EVENT RECEIVED:", roomId);
    socket.join(roomId);
  });


  socket.on("message", ({ roomId, text, senderId }) => {
    console.log("Message received:", roomId, text);

    io.to(roomId).emit("message", {
      text,
      senderId,
      createdAt: Date.now()
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});