import React from 'react'

export const HomeFooter = () => {
  return (
    <>
        <div className='flex fixed bottom-0 left-0 bg-gray-600 w-full justify-evenly p-2 items-center'>
                <div className='flex items-center justify-center flex-col'>
                    <h2>🗣️</h2>
                    <h3>Chats</h3>
                </div>
                <div className='flex items-center justify-center flex-col'>
                    <h2>👨‍👩‍👧‍👦</h2>
                    <h3>Groups</h3>
                </div>
                <div className='flex items-center justify-center flex-col'>
                    <h2>🚨</h2>
                    <h3>Alerts</h3>
                </div>
                <div className='flex items-center justify-center flex-col'>
                    <div className='bg-blue-500 rounded-full p-2'>
                        <h2 className='text-xs font-bold'>AS</h2>
                    </div>
                    <h3>Me</h3>
                </div>
            </div>
    </>
  )
}
