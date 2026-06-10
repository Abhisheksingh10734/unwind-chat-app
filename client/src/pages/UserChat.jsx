import React, { useEffect, useMemo, useState } from 'react';
import { ChatviewFooter } from '../components/ChatviewFooter';
import { ChatviewNav } from '../components/ChatviewNav';
import { io } from "socket.io-client";

export const UserChat = () => {
    const [data, setData] = useState([]);
    const socket = useMemo(() => {
        return io("http://localhost:3000")
    }, []);


    useEffect(() => {
        const handleMessage = (msg) => {
            setData((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: msg.text,
                    sender:
                        msg.senderId === socket.id
                            ? "me"
                            : "other",
                },
            ]);
        };

        socket.on("message", handleMessage);

        return () => {
            socket.off("message", handleMessage);
        };
    }, [socket]);

    return (
        <div className='h-screen w-full bg-[#16132A]'>

            <ChatviewNav />

            <div className="fixed top-16 bottom-14 left-0 right-0 overflow-y-auto bg-gray-400 p-4 scrollbar-none">

                {/* Client 1 Message */}
                {data.map((item) => (
                    <div
                        key={item.id}
                        className={`flex mb-3 ${item.sender === "me"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-[70%] text-white ${item.sender === "me"
                                ? "bg-green-600"
                                : "bg-amber-950"
                                }`}
                        >
                            {item.text}

                            <p className="text-xs text-gray-300 text-right">
                                {new Date(item.id).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            <ChatviewFooter setData={setData} socket={socket} />

        </div>
    )
}
