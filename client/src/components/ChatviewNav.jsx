import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatviewNav = ({user}) => {
    const navigate = useNavigate();
    
    return (
        <>
            <div
                id='nav'
                className='bg-[#2D2A40] w-full flex items-center justify-between px-4 py-2 fixed top-0'
            >
                <div
                    id='navleft'
                    className='flex items-center justify-center gap-4'
                >
                    <div id='backBtn' onClick={() => navigate("/chats")}>
                        <p
                            className='text-xl cursor-pointer'>
                            ⬅️
                        </p>
                    </div>

                    <div
                        id='userlogo'
                        className='bg-[#7C3AED] p-4 rounded-full relative flex items-center justify-center text-xs font-bold'
                    >
                        <div className='absolute bottom-0 right-0 bg-[#22C55E] p-1.5 rounded-full'></div>
                        <h2>{user?.data?.email.slice(0,2).toUpperCase()}</h2>
                    </div>

                    <div className='flex flex-col items-start justify-center'>
                        <h1 className='font-bold'>{user?.data?.email.split('@')[0]}</h1>

                        <div className='flex relative gap-2'>
                            <div className='absolute left-0 top-3/12 bg-[#22C55E] p-1 rounded-full'></div>

                            <h4 className='text-xs ml-3 text-[#22C55E]'>
                                {user?.data?.status}
                            </h4>
                        </div>
                    </div>
                </div>

                <div id='navright'>
                    <h2 className='text-2xl'>🚦</h2>
                </div>
            </div>
        </>
    );
};