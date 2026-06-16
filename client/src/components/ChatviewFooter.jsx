import React, { useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";

export const ChatviewFooter = ({ currentUserId }) => {
    const socket = useSocket();
    const { id } = useParams();

    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim() || !currentUserId || !socket) return;

        const messageData = {
            senderId: currentUserId,
            receiverId: id,
            text: message,
        };

        socket.emit("private-message", messageData);
        setMessage("");
    };

    return (
        <div className="w-full bg-[#2D2A40] fixed bottom-0 left-0 flex items-end gap-3 px-3 py-2">
            <div className="bg-[#1E1B2E] p-2 rounded-lg">🗃️</div>

            <form onSubmit={handleSubmit} className="flex gap-4 flex-1">
                <div className="bg-[#1E1B2E] flex-1 rounded-lg px-3 py-2">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="1"
                        placeholder="Type a message..."
                        className="w-full bg-transparent outline-none resize-none text-white"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#1E1B2E] p-2 rounded-lg cursor-pointer"
                >
                    📤
                </button>
            </form>

            <div className="bg-[#1E1B2E] p-2 rounded-lg">😊</div>
        </div>
    );
};