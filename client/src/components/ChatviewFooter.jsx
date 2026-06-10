import React, { useState } from 'react';
import { useRef } from "react";

export const ChatviewFooter = ({setData, socket}) => {
    const textareaRef = useRef(null);
    const [message, setMessage] = useState("");

    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) return;
        
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
        
        socket.emit("message", {
            text: message,
            senderId: socket.id
        });
        setMessage("");
    };
    
    return (
        <>
            <div className="w-full bg-[#2D2A40] fixed bottom-0 left-0 flex items-end gap-3 px-3 py-2">

                <div className="bg-[#1E1B2E] p-2 rounded-lg">
                    🗃️
                </div>

                <form onSubmit={handleSubmit} className='flex gap-4 flex-1'>
                    <div className="bg-[#1E1B2E] flex-1 rounded-lg px-3 py-2 flex items-center justify-center">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            rows="1"
                            onInput={handleInput}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full scrollbar-none bg-transparent outline-none resize-none text-white placeholder-gray-400 max-h-32 overflow-y-auto"
                        />
                    </div>

                    <button
                        type='submit'
                        className="bg-[#1E1B2E] p-2 rounded-lg cursor-pointer">
                        📤
                    </button>
                </form>

                <div className="bg-[#1E1B2E] p-2 rounded-lg">
                    😊
                </div>


            </div>
        </>
    )
}
