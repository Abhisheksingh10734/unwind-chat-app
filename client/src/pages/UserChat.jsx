import { ChatviewFooter } from "../components/ChatviewFooter";
import { ChatviewNav } from "../components/ChatviewNav";

export const UserChat = ({
    isChatVisible,
    setIsChatVisible,
    setIsHomeVisible,
    setSelectedUser,
    selectedUser,
    userId
}) => {
    return (
        isChatVisible && selectedUser && (
            <div className="h-screen w-full bg-[#16132A]">

                <ChatviewNav
                    setIsChatVisible={setIsChatVisible}
                    setIsHomeVisible={setIsHomeVisible}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                />

                <div className="fixed top-16 bottom-14 left-0 right-0 overflow-y-auto bg-gray-400 p-4 scrollbar-none">

                    {/* Messages will be rendered here */}

                </div>

                <ChatviewFooter
                    selectedUser={selectedUser}
                    userId={userId}
                />

            </div>
        )
    );
};