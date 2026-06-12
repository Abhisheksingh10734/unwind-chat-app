import { ChatviewFooter } from "../components/ChatviewFooter";
import { ChatviewNav } from "../components/ChatviewNav";

export const UserChat = () => {
    return (
        (
            <div className="h-screen w-full bg-[#16132A]">

                <ChatviewNav />

                <div className="fixed top-16 bottom-14 left-0 right-0 overflow-y-auto bg-gray-400 p-4 scrollbar-none">

                </div>

                <ChatviewFooter />

            </div>
        )
    );
};