import React, { useState } from 'react'

const tabs = [
    { icon: '🗣️', label: 'Chats' },
    { icon: '👨‍👩‍👧‍👦', label: 'Groups' },
    { icon: '🚨', label: 'Alerts' },
];

export const HomeFooter = () => {
    const [active, setActive] = useState(0);
    return (
        <div className='flex fixed bottom-0 left-0 w-full bg-[#0D0B1E] border-t border-[#2D2A40] justify-around py-2 items-center z-50'>
            {tabs.map((tab, idx) => (
                <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className='flex flex-col items-center gap-0.5 px-4 py-1'
                >
                    <span className='text-2xl leading-none'>{tab.icon}</span>
                    <span className={`text-[11px] font-medium ${active === idx ? 'text-[#7C3AED]' : 'text-[#6B6880]'}`}>
                        {tab.label}
                    </span>
                </button>
            ))}
            <button
                onClick={() => setActive(3)}
                className='flex flex-col items-center gap-0.5 px-4 py-1'
            >
                <div className='bg-[#2563EB] rounded-full w-7 h-7 flex items-center justify-center'>
                    <span className='text-[11px] font-bold text-white'>AS</span>
                </div>
                <span className={`text-[11px] font-medium ${active === 3 ? 'text-[#7C3AED]' : 'text-[#6B6880]'}`}>
                    Me
                </span>
            </button>
        </div>
    )
}