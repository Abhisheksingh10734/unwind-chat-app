import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export const ChatHome = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const [currentUserDets, setCurrentUserDets] = useState({
        currentUserID: "",
        currentUserUsername: "",
        currentUserEmail: "",
        currentUserAvatar: "",
    });

    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/me");

                if (res.data.success) {
                    // toast.success("Account fetched successfully");

                    setCurrentUserDets({
                        currentUserID: res.data.currentUserID,
                        currentUserUsername: res.data.currentUserUsername,
                        currentUserEmail: res.data.currentUserEmail,
                        currentUserAvatar: res.data.currentUserAvatar,
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error("Internal server error");
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/auth/get-users");

                if (res.data.success) {
                    // toast.success("Chats fetched successfully");

                    setChats(res.data.users || []);
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong while fetching the users.");
            }
        };

        fetchUsers();
    }, []);

    const filteredChats = chats.filter((chat) =>
        chat.username?.toLowerCase().includes(search.toLowerCase())
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
                        {currentUserDets.currentUserUsername} ||{" "}
                        {currentUserDets.currentUserEmail}
                    </p>
                </div>

                {/* Profile */}
                <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-lg font-bold cursor-pointer overflow-hidden">
                    {currentUserDets.currentUserAvatar ? (
                        <img
                            src={currentUserDets.currentUserAvatar}
                            alt={currentUserDets.currentUserUsername}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        currentUserDets.currentUserUsername
                            ?.charAt(0)
                            .toUpperCase()
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="bg-[#1E1B2E] border border-[#2D2A40] rounded-xl px-4 py-3 flex items-center gap-3">

                    <span className="text-[#6B6880] text-lg">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none w-full text-white placeholder:text-[#6B6880]"
                    />
                </div>
            </div>

            {/* Chats Section */}
            <div className="px-4 pb-24">
                {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.user_id}
                            className="bg-[#1E1B2E] border border-[#2D2A40] rounded-xl p-4 mb-3 cursor-pointer hover:border-[#7C3AED] transition-all duration-300"
                            onClick={() =>
                                navigate(`/auth/chats/${chat.id}`)
                            }
                        >
                            <div className="flex justify-between items-center">

                                {/* Left Side */}
                                <div className="flex items-center gap-4">

                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-[#7C3AED] flex items-center justify-center text-lg font-bold overflow-hidden">
                                            {chat.avatar ? (
                                                <img
                                                    src={chat.avatar}
                                                    alt={chat.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                chat.username
                                                    ?.charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <span
                                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#1E1B2E] ${chat.is_online ? "bg-green-500" : "bg-gray-500"
                                                }`}
                                        />
                                    </div>

                                    {/* Chat Info */}
                                    <div>
                                        <h2 className="font-semibold text-white">
                                            {chat.username}
                                        </h2>

                                        <p className="text-sm text-[#6B6880] max-w-[220px] truncate">
                                            {chat.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs text-[#6B6880]">
                                        {
                                            chat.last_seen
                                                ? new Date(chat.last_seen).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : new Date().toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                        }
                                    </span>

                                    {chat.id > 0 && (
                                        <div className="min-w-[22px] h-[22px] px-1 bg-[#7C3AED] rounded-full flex items-center justify-center text-xs font-bold">
                                            {chat.id}
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
            <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#7C3AED] text-white text-3xl font-light shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer">
                +
            </button>

        </div>
    );
};