import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const ChatHome = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [currentUserDets, setCurrentUserDets] = useState({ currentUserID: "", currentUserUsername: "", currentUserEmail: "", currentUserAvatar: "" });

    const chats = [
        {
            id: 1,
            name: "John Doe",
            lastMessage: "Hey, are you free tonight?",
            time: "10:45 PM",
            unread: 3,
            online: true,
        },
        {
            id: 2,
            name: "Sarah Wilson",
            lastMessage: "Let's finish the project tomorrow.",
            time: "09:15 PM",
            unread: 0,
            online: false,
        },
        {
            id: 3,
            name: "Alex Johnson",
            lastMessage: "Check your email.",
            time: "Yesterday",
            unread: 1,
            online: true,
        },
        {
            id: 4,
            name: "Emma Watson",
            lastMessage: "😂😂😂",
            time: "Yesterday",
            unread: 0,
            online: false,
        },
        {
            id: 5,
            name: "Michael Brown",
            lastMessage: "See you tomorrow!",
            time: "Monday",
            unread: 5,
            online: true,
        },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me");
                setCurrentUserDets({ currentUserID: res.data.currentUserID, currentUserUsername: res.data.currentUserUsername, currentUserEmail: res.data.currentUserEmail, currentUserAvatar: res.data.currentUserAvatar });

            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);


    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#16132A] text-white">

            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#1E1B2E] border-b border-[#2D2A40] px-5 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome to{" "}
                        <span className="text-[#7C3AED]">
                            Unwind
                        </span>
                    </h1>

                    <p className="text-[#6B6880] mt-1 text-sm font-bold">
                        {currentUserDets.currentUserUsername} || {currentUserDets.currentUserEmail}
                    </p>
                </div>

                {/* Profile */}
                <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-lg font-bold cursor-pointer">
                    {currentUserDets.currentUserAvatar ? (
                        <img
                            src={currentUserDets.currentUserAvatar}
                            alt={currentUserDets.currentUserUsername}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        currentUserDets.currentUserUsername?.charAt(0).toUpperCase()
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="bg-[#1E1B2E] border border-[#2D2A40] rounded-xl px-4 py-3 flex items-center gap-3">

                    {/* Search Emoji */}
                    <span className="text-[#6B6880] text-lg">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="bg-transparent outline-none w-full text-white placeholder:text-[#6B6880]"
                    />
                </div>
            </div>

            {/* Chats Section */}
            <div className="px-4 pb-24">

                {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            className="bg-[#1E1B2E] border border-[#2D2A40] rounded-xl p-4 mb-3 cursor-pointer hover:border-[#7C3AED] transition-all duration-300"
                            onClick={() => navigate(`/auth/chats/${chat.id}`)}
                        >
                            <div className="flex justify-between items-center">

                                {/* Left Side */}
                                <div className="flex items-center gap-4">

                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-[#7C3AED] flex items-center justify-center text-lg font-bold">
                                            {chat.name.charAt(0)}
                                        </div>

                                        {chat.online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1E1B2E]" />
                                        )}
                                    </div>

                                    {/* Chat Info */}
                                    <div>
                                        <h2 className="font-semibold text-white">
                                            {chat.name}
                                        </h2>

                                        <p className="text-sm text-[#6B6880] max-w-[220px] truncate">
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="flex flex-col items-end gap-2">

                                    <span className="text-xs text-[#6B6880]">
                                        {chat.time}
                                    </span>

                                    {chat.unread > 0 && (
                                        <div className="min-w-[22px] h-[22px] px-1 bg-[#7C3AED] rounded-full flex items-center justify-center text-xs font-bold">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-10">
                        <p className="text-[#6B6880]">
                            No chats found.
                        </p>
                    </div>
                )}

            </div>

            {/* Floating New Chat Button */}
            <button
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#7C3AED] text-white text-3xl font-light shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
                +
            </button>

        </div>
    );
};