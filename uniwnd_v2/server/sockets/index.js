import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

const initializeSocket = (server) => {

    io = new Server(server, {
        cors: { origin: "http://localhost:5173", credentials: true },
    });

    io.on("connection", (socket) => {

        console.log("Connected:", socket.id);

        // Frontend sends userId after connection
        socket.on("register-user", (userId) => {

            onlineUsers.set(
                Number(userId),
                socket.id
            );

            io.emit(
                "user_online",
                Number(userId)
            );
        });

        socket.on("disconnect", () => {

            for (
                const [userId, socketId]
                of onlineUsers.entries()
            ) {
                if (socketId === socket.id) {

                    onlineUsers.delete(userId);

                    io.emit(
                        "user_offline",
                        Number(userId)
                    );

                    break;
                }
            }
        });

        socket.on("join_chat", (roomId) => {

            socket.join(roomId);

            console.log(
                `Socket ${socket.id} joined room ${roomId}`
            );
        });

        socket.on("leave_chat", (roomId) => {

            socket.leave(roomId);
        });
    });

    return io;
};

const getIO = () => io;

const getOnlineUsers = () => onlineUsers;

export const isUserOnline = (userId) => {
    return onlineUsers.has(
        Number(userId)
    );
};

export {
    initializeSocket,
    getIO,
    getOnlineUsers
};