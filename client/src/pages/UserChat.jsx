import React from 'react'

export const UserChat = () => {
  return (
    <div className='h-screen w-full bg-[#16132A]'>
        <div id='nav' className='bg-[#2D2A40] w-full'>
            <div id='navleft'>
                <div id='backBtn'>
                    <p>⬅️</p>
                </div>
                <div id='userlogo'>
                    <div></div>
                    <h2>RK</h2>
                </div>
                <div>
                    <h1>Rahul Kumar</h1>
                    <div>
                        <div></div>
                        <h4>Online</h4>
                    </div>
                </div>
            </div>
            <div id='navright'>
                <h2>🚦</h2>
            </div>
        </div>
    </div>
  )
}
