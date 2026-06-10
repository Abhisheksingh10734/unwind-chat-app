import React from 'react'
import { Home } from './pages/Home'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserChat } from './pages/UserChat';

export const App = () => {

const socket = io("http://localhost:3000");

  return (
    <div className='w-full h-full bg-[#1E1B2E] text-white'>
      {/* <Home /> */}
      <UserChat />
    </div>
  )
}