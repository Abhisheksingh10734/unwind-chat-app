import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const messages = [
        {
            id: 1,
            sender: "other",
            text: "Hey! How are you?",
            time: "10:30 PM",
        },
        {
            id: 2,
            sender: "me",
            text: "I'm good. What about you?",
            time: "10:31 PM",
        },
        {
            id: 3,
            sender: "other",
            text: "Doing great! Working on Unwind 😄",
            time: "10:32 PM",
        },
        {
            id: 4,
            sender: "me",
            text: "Nice! The UI is looking clean.",
            time: "10:33 PM",
        },
    ];

    const handleSend = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        console.log(message);
        setMessage("");
    };

    return (
        <div className="h-screen bg-[#16132A] flex flex-col">

            {/* Header */}
            <div className="h-[80px] bg-[#1E1B2E] border-b border-[#2D2A40] flex items-center justify-between px-5">

                <div className="flex items-center gap-4">

                    {/* Back Button */}
                    <button className="text-white text-xl hover:text-[#7C3AED] cursor-pointer transition" onClick={() => navigate("/auth/chats")}>
                        ←
                    </button>

                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center font-bold text-lg">
                            J
                        </div>

                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1E1B2E]" />
                    </div>

                    {/* User Info */}
                    <div>
                        <h2 className="font-semibold text-white">
                            John Doe
                        </h2>

                        <p className="text-xs text-green-400">
                            Online
                        </p>
                    </div>

                </div>

                {/* Optional Menu */}
                <button className="text-white text-2xl">
                    ⋮
                </button>

            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.sender === "me"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                                msg.sender === "me"
                                    ? "bg-[#7C3AED] text-white rounded-br-md"
                                    : "bg-[#2D2A40] text-white rounded-bl-md"
                            }`}
                        >
                            <p>{msg.text}</p>

                            <p className="text-[10px] opacity-70 mt-2 text-right">
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                className="bg-[#1E1B2E] border-t border-[#2D2A40] p-4"
            >
                <div className="flex gap-3">

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        className="flex-1 bg-[#2D2A40] text-white placeholder:text-[#6B6880] px-4 py-3 rounded-xl outline-none border-2 border-transparent focus:border-[#7C3AED] transition-all"
                    />

                    <button
                        type="submit"
                        className="px-6 bg-[#7C3AED] text-white font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-all"
                    >
                        Send
                    </button>

                </div>
            </form>

        </div>
    );
};