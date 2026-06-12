import React, { useEffect, useState } from 'react'

export const Loader = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + Math.random() * 3
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='w-full h-screen bg-[#16132A] flex flex-col justify-center items-center gap-10'>

      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-white text-3xl font-bold tracking-widest'>UNWIND</h1>
        <p className='text-[#7C3AED] text-sm tracking-widest uppercase'>Your personal chatting app</p>
      </div>

      <div className='relative flex items-center justify-center'>
        <div className='w-24 h-24 rounded-full border-4 border-[#2D2A45] animate-spin'
          style={{ borderTopColor: '#7C3AED', animationDuration: '900ms' }} />
        <div className='w-16 h-16 rounded-full border-4 border-[#2D2A45] animate-spin absolute'
          style={{ borderBottomColor: '#a78bfa', animationDuration: '1400ms', animationDirection: 'reverse' }} />
        <div className='w-8 h-8 rounded-full bg-[#7C3AED] absolute animate-pulse' />
      </div>

      <div className='flex flex-col items-center gap-3 w-64'>
        <div className='w-full h-1.5 bg-[#2D2A45] rounded-full overflow-hidden'>
          <div
            className='h-full bg-[#7C3AED] rounded-full transition-all duration-100'
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className='text-[#bfbec2] text-sm tabular-nums'>
          {Math.min(Math.floor(progress), 100)}%
        </span>
      </div>

      <div className='flex gap-2'>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className='w-2 h-2 rounded-full bg-[#7C3AED] animate-bounce'
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

    </div>
  )
}