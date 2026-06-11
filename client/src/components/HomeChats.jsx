import React, { useState } from 'react';
import { users } from '../utils/home.utils.js';

export const HomeChats = ({ setSelectedUser, setIsHomeVisible, setIsChatVisible }) => {
    function selectUser(user) {
        setSelectedUser({ userLogo: user.userLogo, userName: user.userName, status: user.status, id: user.id })
    };

    return (
        <div className='flex flex-col w-full gap-2'>
            {users.map((item, idx) => (
                <div key={idx} id='chatDiv' className='bg-[#16132A] rounded-xl cursor-pointer hover:bg-[#2D2A40]' onClick={() => {
                    selectUser(item);
                    setIsHomeVisible(false);
                    setIsChatVisible(true);
                }}>
                    <div id='chat' className='flex justify-between p-3 items-center'>
                        <div id='leftContainer' className='flex items-center justify-center gap-4'>
                            <div id='icon' className='bg-purple-900 relative rounded-full p-4 flex items-center justify-center text-xs font-bold'>
                                <h2>{item.userLogo}</h2>
                                <div
                                    className={`w-3 h-3 absolute rounded-full right-0 top-8 ${item.status === 'online'
                                        ? 'bg-[#22C55E]'
                                        : item.status === 'offline'
                                            ? 'bg-[#6B6880]'
                                            : item.status === 'away'
                                                ? 'bg-[#F59E0B]'
                                                : item.status === 'busy'
                                                    ? 'bg-[#EF4444]'
                                                    : 'hidden'
                                        }`}
                                ></div>
                            </div>

                            <div id='name' className='flex flex-col items-start justify-center'>
                                <h2 className='text-[16px]'>{item.userName}</h2>
                                <p className='text-[12px] text-[#6B6880]'>{item.status}</p>
                            </div>

                        </div>

                        <div id='rightContainer' className='flex flex-col items-center justify-center gap-2'>

                            <h4 className='text-[#6B6880] text-xs font-bold'>{item.lastSeen}</h4>

                            {item.pendingCount > 0 && (
                                <span className="bg-[#7C3AED] text-white text-xs min-w-6 h-6 px-2 rounded-full flex items-center justify-center">
                                    {item.pendingCount > 99 ? '99+' : item.pendingCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
