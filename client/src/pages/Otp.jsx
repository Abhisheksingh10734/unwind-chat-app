import React, { useRef, useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.api.js'
import { toast } from 'react-toastify'
import { handlePaste, handleSubmit, handleChange, handleKeyDown } from '../utils/otpBoxControl.utils.js'
import { Loader } from './Loader.jsx'

export const Otp = () => {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [status, setStatus] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [resendsLeft, setResendsLeft] = useState(null)

  const MAX_ATTEMPTS = 3
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)

  const inputRefs = useRef([])
  const timerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const startTimer = () => {
    setResendTimer(30)
    setResendDisabled(true)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOtp = async () => {
    try {
      setIsLoading(true)
      const res = await api.post('/api/otp/resent', { email })

      startTimer()

      if (res.data.success) {
        // Store resends left from backend response
        setResendsLeft(res.data.resendsLeft)

        toast.success(`OTP resent successfully to ${res.data.email}`)

        navigate('/otp', {
          state: { resendsLeft: res.data.resendsLeft }
        })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loader />}

      <div className='min-h-screen w-full flex justify-center items-center px-4 py-8 bg-[#1a0a2e]'>
        <div className='bg-[#7C3AED] p-6 sm:p-8 rounded-2xl w-full max-w-md flex flex-col items-center gap-6 shadow-2xl'>

          {/* Header */}
          <div className='flex flex-col items-center gap-1 text-center'>
            <h1 className='text-xl sm:text-2xl text-white'>
              Welcome to <span className='text-[#16132A] font-bold'>Unwind</span>
            </h1>
            <p className='text-[#bfbec2] text-sm'>Your personal chatting app</p>
          </div>

          {/* Body */}
          <div className='flex flex-col items-center gap-5 w-full'>

            {/* Email info */}
            <p className='text-[#e2d9fb] text-sm text-center leading-relaxed'>
              {email
                ? <>Enter the 6-digit OTP sent to <span className='font-semibold text-white break-all'>{email}</span></>
                : 'No email found. Please go back and try again.'}
            </p>

            {/* OTP inputs */}
            <div className='flex gap-2 sm:gap-3'>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e, idx, otp, setOtp, inputRefs)}
                  onKeyDown={e => handleKeyDown(e, idx, otp, setOtp, inputRefs)}
                  onPaste={e => handlePaste(e, idx, setOtp, inputRefs)}
                  onFocus={e => e.target.select()}
                  className={`
                    w-10 h-12 sm:w-12 sm:h-14 rounded-xl text-center text-white text-xl sm:text-2xl font-medium
                    outline-none transition-all duration-150 bg-[#5B21B6]
                    ${digit ? 'border-2 border-[#c4b5fd]' : 'border-2 border-[#a78bfa]'}
                    ${status === 'error' && !digit ? 'border-2 border-red-400' : ''}
                    focus:border-white focus:bg-[#6D28D9]
                  `}
                />
              ))}
            </div>

            {/* Status message */}
            <div className='h-5 text-sm text-center'>
              {status === 'valid' && (
                <span className='text-green-300'>✓ All digits entered</span>
              )}
              {status === 'error' && (
                <span className='text-red-300'>Incorrect OTP. Please try again.</span>
              )}
              {status === 'locked' && (
                <span className='text-red-300'>Account temporarily locked.</span>
              )}
              {status && !['valid', 'error', 'locked'].includes(status) && (
                <span className='text-[#bfbec2]'>{status}</span>
              )}
            </div>

            {/* Attempts left */}
            <div className={`
              flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium
              ${isLocked
                ? 'bg-red-900/40 border border-red-500/50'
                : attemptsLeft <= 2
                  ? 'bg-orange-900/40 border border-orange-500/50'
                  : 'bg-[#5B21B6]/60 border border-[#a78bfa]/30'}
            `}>
              <span className={isLocked ? 'text-red-300' : attemptsLeft <= 2 ? 'text-orange-300' : 'text-[#c4b5fd]'}>
                {isLocked ? '🔒 Account locked' : '🛡️ Attempts remaining'}
              </span>
              <div className='flex items-center gap-2'>
                <div className='flex gap-1'>
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <span
                      key={i}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${i < attemptsLeft
                          ? isLocked ? 'bg-red-400' : attemptsLeft <= 2 ? 'bg-orange-400' : 'bg-[#c4b5fd]'
                          : 'bg-[#3d2070]'}
                      `}
                    />
                  ))}
                </div>
                <span className={`font-bold tabular-nums ${isLocked ? 'text-red-300' : attemptsLeft <= 2 ? 'text-orange-300' : 'text-white'}`}>
                  {isLocked ? '0' : attemptsLeft}/{MAX_ATTEMPTS}
                </span>
              </div>
            </div>

            {/* Resends left — shown only after first resend click */}
            {resendsLeft !== null && (
              <div className={`
                flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-medium
                ${resendsLeft === 0
                  ? 'bg-red-900/40 border border-red-500/50 text-red-300'
                  : resendsLeft === 1
                    ? 'bg-orange-900/40 border border-orange-500/50 text-orange-300'
                    : 'bg-[#5B21B6]/60 border border-[#a78bfa]/30 text-[#c4b5fd]'}
              `}>
                {resendsLeft === 0
                  ? '⚠️ No resends left'
                  : `📩 ${resendsLeft} resend${resendsLeft === 1 ? '' : 's'} remaining`}
              </div>
            )}

            {/* Wrong email */}
            <p className='text-[#bfbec2] text-sm text-center'>
              Wrong email?{' '}
              <Link to='/' className='text-[#c4b5fd] font-semibold hover:text-white underline underline-offset-2 transition-colors'>
                Go back
              </Link>
            </p>

            {/* Resend OTP */}
            <div className='flex flex-col items-center gap-1'>
              <p className='text-[#bfbec2] text-sm text-center'>
                Didn't receive the OTP?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled || resendsLeft === 0}
                className={`text-sm font-semibold transition-all duration-150 ${
                  resendDisabled || resendsLeft === 0
                    ? 'text-[#7a6fa0] cursor-not-allowed'
                    : 'text-[#c4b5fd] hover:text-white underline underline-offset-2 cursor-pointer'
                }`}
              >
                {resendsLeft === 0
                  ? 'No resends left'
                  : resendDisabled
                    ? `Resend OTP in ${resendTimer}s`
                    : 'Resend OTP'}
              </button>
            </div>

            {/* Submit button */}
            <button
              onClick={() => handleSubmit(otp, setStatus, setIsSubmitting, setAttemptsLeft, setIsLocked, attemptsLeft, MAX_ATTEMPTS, email, navigate)}
              disabled={isSubmitting || isLocked}
              className='bg-[#6B6880] hover:bg-[#6C7992] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-wider py-2.5 rounded-xl w-2/3 sm:w-1/2 transition-all duration-150 cursor-pointer'
            >
              {isSubmitting ? 'Verifying…' : isLocked ? 'Locked' : 'Verify OTP'}
            </button>

          </div>
        </div>
      </div>
    </>
  )
}