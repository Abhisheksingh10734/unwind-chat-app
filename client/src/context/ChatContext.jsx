import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [username, setUsername] = useState(null);
    const [userStatus, setUserStatus] = useState(null);

    return (
        <ChatContext.Provider
            value={{
                setUserProfile,
                setUsername,
                setUserStatus,
                userProfile,
                username,
                userStatus
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};