import React from 'react'
import { Home } from './pages/Home'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserChat } from './pages/UserChat';

export const App = () => {

  const socket = io("http://localhost:3000");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isHomeVisible, setIsHomeVisible] = useState(true);
  const [selectedUser, setSelectedUser] = useState({ userLogo: "", userName: "", status: "", id: "" });
  const [userId] = useState(
    () => Number(prompt("Enter User ID"))
  );

  // useEffect(() => {
  //   console.log(isChatVisible);
  //   console.log(isHomeVisible);
  //   console.log(selectedUser);

  // }, [isChatVisible, isHomeVisible, selectedUser]);

  return (
    <div className='w-full h-full bg-[#1E1B2E] text-white'>
      {isHomeVisible && <Home setSelectedUser={setSelectedUser} setIsChatVisible={setIsChatVisible} setIsHomeVisible={setIsHomeVisible} />}
      <UserChat isChatVisible={isChatVisible} setIsChatVisible={setIsChatVisible} setIsHomeVisible={setIsHomeVisible} selectedUser={selectedUser} setSelectedUser={setSelectedUser} userId={userId} />
    </div>
  )
}