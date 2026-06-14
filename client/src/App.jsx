import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Otp } from './pages/Otp';
import { Signup } from './pages/Signup';
import { UserChat } from './pages/UserChat';
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export const App = () => {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='w-full h-screen bg-[#1E1B2E] text-white'>

       <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>


      {/* <Home /> */}

      {/* <UserChat /> */}

    </div>
  );
};