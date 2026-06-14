import React, { useState } from 'react';
import { homeNav } from '../utils/home.utils.js';

export const HomeNav = () => {
  const [active, setActive] = useState(0);
  return (
    <div className='flex gap-1 overflow-x-auto scrollbar-hide'>
      {homeNav.map((item, idx) => (
        <button
          key={idx}
          onClick={() => setActive(idx)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            active === idx
              ? 'bg-[#7C3AED] text-white'
              : 'text-[#b5b5b6] hover:text-white hover:bg-[#2D2A40]'
          }`}
        >
          {item.title}
        </button>
      ))}
    </div>
  )
}