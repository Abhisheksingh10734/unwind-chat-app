import React from 'react';
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from './pages/Signup';
import { VerifyOtp } from './pages/VerifyOtp';
import { ProfileSetup } from './pages/ProfileSetup';
import { ChatHome } from './pages/ChatHome';
import { Chat } from './pages/Chat';

export const App = () => {
  return (
    <div className="w-full h-screen bg-[#16132A] text-white">

      <Toaster richColors position='top-right'
        theme='dark' visibleToasts={1} duration={2500} expand toastOptions={{
          style: {
            background: "#1E1B2E",
            color: "#FFFFFF",
            border: "1px solid #7C3AED",
          },
        }} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/setup/profile" element={<ProfileSetup />} />
          <Route path="/auth/chats" element={<ChatHome />} />
          <Route path="/auth/chats/:id" element={<Chat />} />
        </Routes>
      </BrowserRouter>

    </div>
  )
}
