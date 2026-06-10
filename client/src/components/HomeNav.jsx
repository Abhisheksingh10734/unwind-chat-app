import React from 'react';
import { homeNav } from '../utils/home.utils.js';

export const HomeNav = () => {
  return (
    <>
      <div className='flex justify-around gap-8 text-[#b5b5b6]'>
        {homeNav.map((item, idx) => (
          <h3 key={idx}>{item.title}</h3>
        ))}
      </div>
    </>
  )
}
