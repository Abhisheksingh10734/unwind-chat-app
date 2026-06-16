import { ChatviewFooter } from "../components/ChatviewFooter";
import { ChatviewNav } from "../components/ChatviewNav";
import { useParams } from "react-router-dom";
import { api } from "../../api/axios.api";
import { useEffect, useState, useContext } from "react";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

export const UserChat = () => {
    const { user: currentUserEmail } = useContext(AuthContext);
    const socket = useSocket();
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([]);

    // Get chat user
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await api.get(`/api/users/${id}`);
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        getUser();
    }, [id]);

    // Get current logged in user
    useEffect(() => {
        if (!currentUserEmail?.email) return;

        const getCurrentUser = async () => {
            try {
                const res = await api.post("/api/me", {
                    email: currentUserEmail.email,
                });
                setCurrentUserId(res.data.data.id);
            } catch (err) {
                console.error(err);
            }
        };

        getCurrentUser();
    }, [currentUserEmail]);

    // Register user socket
    useEffect(() => {
        if (!socket || !currentUserId) return;
        socket.emit("leave", currentUserId);
        socket.emit("join", currentUserId);
    }, [socket, currentUserId]);

    // Receive messages
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on("receive-message", handleMessage);

        return () => {
            socket.off("receive-message", handleMessage);
        };
    }, [socket]);

    return (
        <div className="h-screen w-full bg-[#16132A]">
            <ChatviewNav user={user} />

            <div className="fixed top-16 bottom-14 left-0 right-0 bg-gray-600 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg, index) => (
                    <div
                        key={`${msg.senderId}-${msg.receiverId}-${index}`}
                        className={`flex ${
                            String(msg.senderId) === String(currentUserId)
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`p-2 rounded-lg max-w-[60%] text-white ${
                                String(msg.senderId) === String(currentUserId)
                                    ? "bg-blue-800"
                                    : "bg-green-800"
                            }`}
                        >
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <ChatviewFooter currentUserId={currentUserId} />
        </div>
    );
};