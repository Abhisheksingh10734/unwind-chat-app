import { useEffect, useMemo, useState } from 'react';
import { ChatviewFooter } from '../components/ChatviewFooter';
import { ChatviewNav } from '../components/ChatviewNav';
import { io } from "socket.io-client";

export const UserChat = ({ isChatVisible, setIsChatVisible, setIsHomeVisible, setSelectedUser, selectedUser, userId }) => {
    const [data, setData] = useState([]);

    const filteredMessages = data.filter((msg) => {
        return (
            (msg.senderId === userId &&
                msg.receiverId === selectedUser.id) ||

            (msg.senderId === selectedUser.id &&
                msg.receiverId === userId)
        );
    });

    console.log("data: ", data);
    console.log("filtered: ", filteredMessages);

    const socket = useMemo(() => {
        return io("http://localhost:3000")
    }, []);

    useEffect(() => {
        const handleMessage = (msg) => {
            console.log("Received:", msg);
            setData((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: msg.text,
                    senderId: msg.senderId,
                    receiverId: msg.to,
                    createdAt: msg.createdAt,
                },
            ]);

        };

        socket.emit("register", userId);
        socket.on("message", handleMessage);

        return () => {
            socket.off("message", handleMessage);
        };
    }, [socket, userId]);

    return (
        isChatVisible && (
            <div className='h-screen w-full bg-[#16132A]'>

                <ChatviewNav socket={socket} setIsChatVisible={setIsChatVisible} setIsHomeVisible={setIsHomeVisible} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />

                <div className="fixed top-16 bottom-14 left-0 right-0 overflow-y-auto bg-gray-400 p-4 scrollbar-none">

                    {filteredMessages.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex mb-3 ${item.senderId === userId
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-[70%] text-white ${item.senderId === userId
                                    ? "bg-green-600"
                                    : "bg-amber-950"
                                    }`}
                            >
                                {item.text}

                                <p className="text-xs text-gray-300 text-right">
                                    {item.createdAt &&
                                        new Date(item.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

                <ChatviewFooter setData={setData} socket={socket} selectedUser={selectedUser} userId={userId} />

            </div>
        )
    );

};