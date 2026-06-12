import React, { useRef, useState } from 'react'

export const Otp = () => {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [status, setStatus] = useState('')
  const inputRefs = useRef([])

  const updateStatus = (newOtp) => {
    const filled = newOtp.filter(v => v !== '').length
    if (filled === 6) setStatus('valid')
    else if (filled > 0) setStatus(`${filled} of 6 entered`)
    else setStatus('')
  }

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return
    const digit = val[val.length - 1]
    const newOtp = [...otp]
    newOtp[idx] = digit
    setOtp(newOtp)
    updateStatus(newOtp)
    if (idx < 5) inputRefs.current[idx + 1].focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      if (otp[idx] !== '') {
        newOtp[idx] = ''
        setOtp(newOtp)
        updateStatus(newOtp)
      } else if (idx > 0) {
        newOtp[idx - 1] = ''
        setOtp(newOtp)
        updateStatus(newOtp)
        inputRefs.current[idx - 1].focus()
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1].focus()
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputRefs.current[idx + 1].focus()
    }
  }

  const handlePaste = (e, idx) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((ch, i) => {
      if (idx + i < 6) newOtp[idx + i] = ch
    })
    setOtp(newOtp)
    updateStatus(newOtp)
    const next = Math.min(idx + pasted.length, 5)
    inputRefs.current[next].focus()
  }

  const handleSubmit = () => {
    if (otp.some(v => v === '')) {
      setStatus('error')
      inputRefs.current.find((_, i) => otp[i] === '')?.focus()
      return
    }
    console.log('OTP submitted:', otp.join(''))
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='bg-[#7C3AED] p-8 rounded-xl w-full max-w-md flex flex-col items-center gap-8'>

        <div className='flex flex-col items-center gap-1'>
          <h1 className='text-2xl text-white'>
            Welcome to the <span className='text-[#16132A] font-bold'>Unwind</span>
          </h1>
          <p className='text-[#bfbec2]'>Your personal chatting app</p>
        </div>

        <div className='flex flex-col items-center gap-6 w-full'>
          <p className='text-[#e2d9fb] text-sm'>Enter the 6-digit OTP sent to your device</p>

          <div className='flex gap-3'>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                onPaste={e => handlePaste(e, idx)}
                onFocus={e => e.target.select()}
                className={`
                  w-12 h-14 rounded-xl text-center text-white text-2xl font-medium
                  outline-none transition-all duration-150 bg-[#5B21B6]
                  ${digit ? 'border-2 border-[#c4b5fd]' : 'border-2 border-[#a78bfa]'}
                  focus:border-white focus:bg-[#6D28D9]
                `}
              />
            ))}
          </div>

          <div className='h-5 text-sm'>
            {status === 'valid' && (
              <span className='text-green-300'>✓ All digits entered</span>
            )}
            {status === 'error' && (
              <span className='text-red-300'>Please fill in all 6 digits</span>
            )}
            {status && status !== 'valid' && status !== 'error' && (
              <span className='text-[#bfbec2]'>{status}</span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className='bg-[#6B6880] hover:bg-[#6C7992] active:scale-95 text-white font-bold tracking-wider py-2 rounded-xl w-1/2 transition-all duration-150'
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  )
}