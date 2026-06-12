import React, { useState } from 'react';
import { Home } from './pages/Home';
import { UserChat } from './pages/UserChat';

export const App = () => {

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isHomeVisible, setIsHomeVisible] = useState(true);

  const [selectedUser, setSelectedUser] = useState({
    userLogo: "",
    userName: "",
    status: "",
    id: ""
  });

  return (
    <div className='w-full h-full bg-[#1E1B2E] text-white'>

      {isHomeVisible && (
        <Home
          setSelectedUser={setSelectedUser}
          setIsChatVisible={setIsChatVisible}
          setIsHomeVisible={setIsHomeVisible}
        />
      )}

      <UserChat
        isChatVisible={isChatVisible}
        setIsChatVisible={setIsChatVisible}
        setIsHomeVisible={setIsHomeVisible}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

    </div>
  );
};