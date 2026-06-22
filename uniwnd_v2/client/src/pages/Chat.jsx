import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import api from "../api/axios";

export const Chat = () => {
    const [message, setMessage] = useState({
        from: "",
        to: "",
        text: ""
    });

    const [inputVal, setInputVal] = useState("")

    const navigate = useNavigate();
    const socket = useSocket();
    const params = useParams();
    const receiverId = params.id;
    const [receiverDets, setReceiverDets] = useState({
        id: "",
        receiverUsername: "",
        receiverAvatar: "",
        receiverOnlineStatus: ""
    });

    useEffect(() => {
        const fetchReceiver = async () => {
            try {
                const res = await api.get(`/api/auth/chats/${receiverId}`);

                if (res.data.success) {
                    setReceiverDets({
                        id: res.data.receiver.id,
                        receiverUsername: res.data.receiver.username,
                        receiverAvatar: res.data.receiver.avatar,
                        receiverOnlineStatus: res.data.receiver.is_online
                    })
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchReceiver();
    }, [receiverId]);


    const handleSend = (e) => {
        e.preventDefault();

        if(inputVal.trim() === "") {
            return;
        }

        setMessage({
            from: receiverId,
            to: "",
            text: inputVal
        });

        useEffect(() => {
          const sendMessage = async () => {
            const res = api.post("/api/auth/send-message", {message});
          }
        }, [])
        
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
                            {receiverDets.receiverAvatar ? (
                                <img
                                    src={receiverDets.receiverAvatar}
                                    alt={receiverDets.receiverUsername}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                receiverDets.receiverUsername
                                    ?.charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <span
                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#1E1B2E] ${receiverDets.is_online ? "bg-green-500" : "bg-gray-500"
                                }`}
                        />
                    </div>

                    {/* User Info */}
                    <div>
                        <h2 className="font-semibold text-white">
                            {receiverDets.receiverUsername}
                        </h2>

                        <p className="text-xs text-green-400">
                            {receiverDets.is_online ? "Online" : "Offline"}
                        </p>
                    </div>

                </div>

                {/* Optional Menu */}
                <button className="text-white text-2xl cursor-pointer">
                    ⋮
                </button>

            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">

                {/* {messages.map((msg) => (
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
                ))} */}

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
                        value={inputVal}
                        onChange={(e) =>
                            setInputVal(e.target.value)
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