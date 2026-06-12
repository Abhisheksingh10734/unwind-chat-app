import React from 'react'

export const Signup = () => {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='bg-[#7C3AED] p-8 rounded-xl w-1/2 flex flex-col items-center justify-between'>

                <div className='mb-10 flex flex-col items-center'>
                    <h1 className='text-2xl'>Welcome to the <span className='text-[#16132A] font-bold'>Unwind</span></h1>
                    <p className='text-[#bfbec2]'>Your personal chatting app</p>
                </div>

                <form className='w-full flex flex-col gap-8'>
                    <input type="email"
                    autoComplete='off'
                    placeholder='Enter your email ...'
                    className='outline-none border-[#bfbec2] border-2 px-4 py-2 rounded-xl' />

                    <div className='flex flex-col items-center'>
                        <button type='submit' className='border-2 py-2 rounded-xl w-1/2 cursor-pointer bg-[#6B6880] hover:bg-[#6C7992] font-bold tracking-wider active:scale-95'>Get OTP</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
