import React, { useState } from 'react';
import { Loader } from './Loader';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios.api';
import { verifyEmail } from '../utils/emailVerification.utils';
import { toast } from "react-toastify";

export const Signup = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [emailVal, setEmailVal] = useState("");

    const handleOtpSent = async (e) => {
        e.preventDefault();

        const error = verifyEmail(emailVal);

        if (error) {
            setEmailVal("");
            return toast.error(error, {
                toastId: "emailWarning",
            });
        }

        try {
            setIsLoading(true);

            const res = await api.post("/api/otp/sent", {
                email: emailVal,
            });

            if (!res.data.success) {
                return toast.error(res.data.message);
            }

            toast.success(`OTP sent successfully to ${res.data.email}`);

            navigate("/otp", {
                state: {
                    email: emailVal,
                },
            });

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>

            {isLoading && <Loader />}

            <div className='w-full h-screen flex justify-center items-center'>
                <div className='bg-[#7C3AED] p-8 rounded-xl w-1/2 flex flex-col items-center justify-between'>

                    <div className='mb-10 flex flex-col items-center'>
                        <h1 className='text-2xl'>Welcome to the <span className='text-[#16132A] font-bold'>Unwind</span></h1>
                        <p className='text-[#bfbec2]'>Your personal chatting app</p>
                    </div>

                    <form className='w-full flex flex-col gap-8'>
                        <input type="text"
                            value={emailVal}
                            onChange={(e) => setEmailVal(e.target.value)}
                            autoComplete='off'
                            placeholder='Enter your email ...'
                            className='outline-none border-[#bfbec2] border-2 px-4 py-2 rounded-xl' />

                        <div className='flex flex-col items-center'>
                            <button type='submit' className='border-2 py-2 rounded-xl w-1/2 cursor-pointer bg-[#6B6880] hover:bg-[#6C7992] font-bold tracking-wider active:scale-95'
                                onClick={(e) => handleOtpSent(e)}
                            >Get OTP</button>
                        </div>
                    </form>

                    <div className='mt-5'>
                        <h4>Already have an account? <Link to={"/otp"}><span className='text-blue-800 font-bold'>Log in</span></Link></h4>
                    </div>
                </div>
            </div>
        </>
    )
}
