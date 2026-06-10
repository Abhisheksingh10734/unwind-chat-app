import React from 'react';
import { ChatviewFooter } from '../components/ChatviewFooter';
import { ChatviewNav } from '../components/ChatviewNav';

export const UserChat = () => {
    return (
        <div className='h-screen w-full bg-[#16132A]'>

        <ChatviewNav />

        <ChatviewFooter />

        </div>
    )
}
