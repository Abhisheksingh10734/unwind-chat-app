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

const handleSubmit = async () => {
    if (isLocked) return
    if (otp.some(v => v === '')) {
        setStatus('error')
        inputRefs.current.find((_, i) => otp[i] === '')?.focus()
        return
    }
    setIsSubmitting(true)
    try {
        // Replace with your actual submit API call
        // await api.post('/otp/verify', { email, otp: otp.join('') })
        console.log('OTP submitted:', otp.join(''))
        toast.success('OTP verified successfully')
        // navigate('/dashboard')
    } catch (err) {
        const remaining = attemptsLeft - 1
        setAttemptsLeft(remaining)
        if (remaining <= 0) {
            setIsLocked(true)
            setStatus('locked')
            toast.error('Too many failed attempts. Please request a new OTP.')
        } else {
            toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.')
            setStatus('error')
        }
        setOtp(Array(6).fill(''))
        inputRefs.current[0]?.focus()
    } finally {
        setIsSubmitting(false)
    }
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

const updateStatus = (newOtp) => {
    const filled = newOtp.filter(v => v !== '').length
    if (filled === 6) setStatus('valid')
    else if (filled > 0) setStatus(`${filled} of 6 entered`)
    else setStatus('')
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

const handleResend = async () => {
    if (resendDisabled) return
    try {
        await api.post('/otp/resend', { email })
        toast.success('OTP resent successfully')
        setOtp(Array(6).fill(''))
        setStatus('')
        setAttemptsLeft(MAX_ATTEMPTS)
        setIsLocked(false)
        inputRefs.current[0]?.focus()
        startTimer()
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to resend OTP')
    }
}

export { handlePaste, handleSubmit, handleChange, updateStatus, handleKeyDown, handleResend }