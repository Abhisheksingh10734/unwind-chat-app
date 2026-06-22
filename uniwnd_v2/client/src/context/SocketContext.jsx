import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:3000", {
            withCredentials: true,
            transports: ["websocket"],
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            console.log("Socket Connected:", socketInstance.id);
        });

        socketInstance.on("disconnect", () => {
            console.log("Socket Disconnected");
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};