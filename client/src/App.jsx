import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Otp } from './pages/Otp';
import { Signup } from './pages/Signup';
import { UserChat } from './pages/UserChat';
import { useState } from "react";

export const App = () => {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='w-full h-screen bg-[#1E1B2E] text-white'>

      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>


      {/* <Home /> */}

      {/* <UserChat /> */}

    </div>
  );
};