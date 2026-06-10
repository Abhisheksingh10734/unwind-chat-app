import React from 'react';
import { ChatviewFooter } from '../components/ChatviewFooter';
import { ChatviewNav } from '../components/ChatviewNav';

export const UserChat = () => {
    return (
        <div className='h-screen w-full bg-[#16132A]'>

            <ChatviewNav />

            <div className="fixed top-16 bottom-14 left-0 right-0 overflow-y-auto bg-gray-400 p-4">

                {/* Client 1 Message */}
                <div className="flex justify-start mb-3">
                    <div className="bg-amber-950 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        Hi, how are you?
                    </div>
                </div>

                {/* Client 2 Message */}
                <div className="flex justify-end mb-3">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        I'm fine. What about you?
                    </div>
                </div>

                {/* More messages */}
                <div className="flex justify-start mb-3">
                    <div className="bg-amber-950 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        Doing great 🚀
                    </div>
                </div>

                <div className="flex justify-end mb-3">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        What are you doing these days?
                    </div>
                </div>

                <div className="flex justify-start mb-3">
                    <div className="bg-amber-950 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        Nothing just regretting about why I chose B.A. (Hons.) Hindi in my graduation.
                    </div>
                </div>

                <div className="flex justify-end mb-3">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        Why brother why are you regretting ?
                    </div>
                </div>

                <div className="flex justify-start mb-3">
                    <div className="bg-amber-950 text-white px-4 py-2 rounded-lg max-w-[70%]">
                        Because I'm still unemployed and I'm wasted my three years in graduation and still I don't have any skills. So what should i do now, i don't know.
                    </div>
                </div>

            </div>

            <ChatviewFooter />

        </div>
    )
}
