import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isHomeChat, setIsHomeChat] = useState(false);

    return (
        <ChatContext.Provider
            value={{
                isChatVisible,
                setIsChatVisible,
                isHomeChat,
                setIsHomeChat
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};