import React from 'react';
import { useRef } from "react";

export const ChatviewFooter = () => {
    const textareaRef = useRef(null);
    
      const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      };
    return (
        <>
            <div className="w-full bg-[#2D2A40] fixed bottom-0 left-0 flex items-end gap-3 px-3 py-2">

                <div className="bg-[#1E1B2E] p-2 rounded-lg">
                    🗃️
                </div>

                <div className="bg-[#1E1B2E] flex-1 rounded-lg px-3 py-2 flex items-center justify-center">
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        onInput={handleInput}
                        placeholder="Type a message..."
                        className="w-full bg-transparent outline-none resize-none text-white placeholder-gray-400 max-h-32 overflow-y-auto"
                    />
                </div>

                <div className="bg-[#1E1B2E] p-2 rounded-lg">
                    😊
                </div>

                <button className="bg-[#1E1B2E] p-2 rounded-lg">
                    📤
                </button>

            </div>
        </>
    )
}
