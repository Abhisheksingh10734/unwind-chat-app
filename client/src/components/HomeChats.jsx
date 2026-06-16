import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext.jsx";
import { useChat } from "../context/ChatContext";
import { useNavigate, useParams } from "react-router-dom";

const statusColor = {
    online: "bg-[#22C55E]",
    offline: "bg-[#6B6880]",
    away: "bg-[#F59E0B]",
    busy: "bg-[#EF4444]",
};

export const HomeChats = () => {
    const socket = useSocket();
    const [allUsers, setAllUsers] = useState([]);
    const { id, email } = useParams();
    const navigate = useNavigate();
    const { setUserProfile, setUsername, setUserStatus } = useChat();

    useEffect(() => {

    const handleUsers = (data) => {
        setAllUsers(data);
    };

    socket.on("all-users", handleUsers);

    if (socket.connected) {
        socket.emit("get-all-users");
    }

    socket.on("connect", () => {
        socket.emit("get-all-users");
    });

    return () => {
        socket.off("all-users", handleUsers);
        socket.off("connect");
    };
}, [socket]);

    return (
        allUsers.length > 0 ? (
            <div className="flex flex-col w-full gap-2">
                {allUsers.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#16132A] rounded-xl cursor-pointer hover:bg-[#2D2A40] transition-colors duration-150"
                        onClick={() => navigate(`/chats/${item.id}/${item.email}`)}
                    >
                        <div className="flex justify-between p-3 items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-900 relative rounded-full w-11 h-11 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    <span>{item.email?.slice(0, 2).toUpperCase() ?? 'NA'}</span>

                                    <div
                                        className={`w-3 h-3 absolute rounded-full right-0 bottom-0 border-2 border-[#16132A] ${statusColor[item.status] ?? "hidden"
                                            }`}
                                    />
                                </div>

                                <div className="flex flex-col items-start justify-center">
                                    <h2 className="text-[15px] font-medium text-white">
                                        {item.email?.split('@')[0]}
                                    </h2>

                                    <p className="text-[12px] text-[#6B6880] capitalize">
                                        {item.status ?? "offline"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-center gap-1.5">
                                <span className="text-[#6B6880] text-[11px] font-semibold whitespace-nowrap">
                                    {item.lastSeen ?? ""}
                                </span>

                                {item.pendingCount > 0 && (
                                    <span className="bg-[#7C3AED] text-white text-[11px] min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center font-semibold">
                                        {item.pendingCount > 99
                                            ? "99+"
                                            : item.pendingCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <h1>No Chats Found</h1>
        )
    );
};