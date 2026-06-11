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

  socket.on("register", (userId) => {
    users.set(userId, socket.id);

    console.log("Registered:", userId);
    console.log(users);
  });

  socket.on("private-message", (msg) => {

    const receiverSocketId = users.get(msg.to);

    socket.emit("message", msg);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});