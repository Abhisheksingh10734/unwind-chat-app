import React, { useState } from 'react';
import { toast } from "sonner";
import { verifyEmail } from '../utils/verifyEmail.utils';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const [emailInput, setEmailInput] = useState("");
    const [btnText, setbtnText] = useState("Signup");
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const error = verifyEmail(emailInput);

        if (error) {
            return toast.error(error);
        }

        try {
            setbtnText("Signing up...");

            const res = await api.post(
                "/api/auth/send-otp",
                { email: emailInput }
            );

            if(res.data.success) {
                toast.success(res.data.message);
                navigate("/verify-otp", {
                    state: {
                        email: emailInput
                    }
                });
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            setEmailInput("");
            setbtnText("Signup");
        }
    };

    return (
        <div className="min-h-screen bg-[#16132A] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#1E1B2E] rounded-2xl p-8 shadow-2xl border border-[#2D2A40]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome to{' '}
                        <span className="text-[#7C3AED]">Unwind</span>
                    </h1>

                    <p className="text-[#6B6880] mt-2">
                        Signup to create your account
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Email Address
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your email..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full bg-[#2D2A40] text-white placeholder:text-[#6B6880] px-4 py-3 rounded-lg outline-none border-2 border-transparent focus:border-[#7C3AED] transition-all duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#7C3AED] text-white font-bold tracking-wide py-3 rounded-lg transition-all duration-300 hover:brightness-110 active:scale-95 cursor-pointer"
                    >
                        {btnText}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <span className="text-[#6B6880]">
                        Already have an account?
                    </span>{' '}
                    <span className="text-[#7C3AED] font-bold cursor-pointer hover:underline">
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
};