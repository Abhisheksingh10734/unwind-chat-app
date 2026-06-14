import React from 'react'

export const HomeSearchbar = () => {
  return (
    <div>
      <input
        type="text"
        placeholder='Search...'
        className='bg-[#2D2A40] w-full rounded-xl px-5 py-2.5 outline-none focus:ring-2 focus:ring-[#7C3AED] text-white placeholder-[#6B6880] text-sm font-medium tracking-wide transition-all'
      />
    </div>
  )
}