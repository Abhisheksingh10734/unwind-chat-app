import React from 'react';

export const ChatviewNav = ({
    setIsChatVisible,
    setIsHomeVisible,
    setSelectedUser,
    selectedUser
}) => {
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
                    <div id='backBtn'>
                        <p
                            className='text-xl cursor-pointer'
                            onClick={() => {
                                setIsChatVisible(false);
                                setIsHomeVisible(true);
                                setSelectedUser({
                                    userLogo: "",
                                    userName: "",
                                    status: "",
                                    id: ""
                                });
                            }}
                        >
                            ⬅️
                        </p>
                    </div>

                    <div
                        id='userlogo'
                        className='bg-[#7C3AED] p-4 rounded-full relative flex items-center justify-center text-xs font-bold'
                    >
                        <div className='absolute bottom-0 right-0 bg-[#22C55E] p-1.5 rounded-full'></div>
                        <h2>{selectedUser.userLogo}</h2>
                    </div>

                    <div className='flex flex-col items-start justify-center'>
                        <h1 className='font-bold'>{selectedUser.userName}</h1>

                        <div className='flex relative gap-2'>
                            <div className='absolute left-0 top-3/12 bg-[#22C55E] p-1 rounded-full'></div>

                            <h4 className='text-xs ml-3 text-[#22C55E]'>
                                {selectedUser.status}
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