import React from 'react';
import { HomeTopbar } from "../components/HomeTopbar";
import { HomeSearchbar } from "../components/HomeSearchbar";
import { HomeNav } from "../components/HomeNav";
import { HomeChats } from "../components/HomeChats";
import { HomeFooter } from "../components/HomeFooter";
import { useSocket } from "../context/SocketContext";
import { useState } from 'react';
import { useEffect } from 'react';

export const Home = () => {

    const socket = useSocket();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
    socket.emit("get-current-user");

    const handleUser = (user) => {
        setCurrentUser(user.email);
    };

    socket.on("connected-user", handleUser);

    
    
    return () => {
        socket.off("connected-user", handleUser);
    };
}, [socket]);

    return (
        <div className='flex flex-col gap-4 px-4 py-2 pb-24 bg-[#0D0B1E] min-h-screen'>
            <HomeTopbar />
            <HomeSearchbar />
            <HomeNav />
            <HomeChats />
            <HomeFooter />
        </div>
    );
};