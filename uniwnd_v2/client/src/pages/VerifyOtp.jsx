import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export const VerifyOtp = () => {
    const { state } = useLocation();

    const userEmail = state?.email;
    const navigate = useNavigate();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verifyBtnText, setverifyBtnText] = useState("Verify OTP")
    const inputRefs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    if (!userEmail) {
        navigate("/");
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            return toast.error("Please enter all 6 digits");
        }

        try {
            setverifyBtnText("Verifying...");

            const res = await api.post("/api/auth/verify-otp", {
                userOtp: enteredOtp,
                email: userEmail
            });

            if (res.data.success) {
                setOtp(["", "", "", "", "", ""]);
                toast.success(res.data.message);
                navigate("/setup/profile", {
                    state: {
                        email: userEmail
                    }
                });
            } else {
                toast.error(res.data.message);
            }


        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setverifyBtnText("Verify OTP");
        }
    };

    const handleResendOtp = async () => {
        setOtp(["", "", "", "", "", ""]);
        toast.info("Sending OTP...")
        try {
            const res = await api.post("/api/auth/resend-otp", {
            email: userEmail
        });

        if(res.data.success) {
            toast.success(res.data.message);
        } else {
            toast.error(toast.res.message);
        }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#16132A] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#1E1B2E] border border-[#2D2A40] rounded-2xl p-8 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Verify <span className="text-[#7C3AED]">OTP</span>
                    </h1>

                    <p className="text-[#6B6880] mt-2 text-sm">
                        Enter the 6-digit verification code sent to {userEmail}
                    </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex justify-center gap-2 sm:gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                                className="
                                    w-12 h-14
                                    sm:w-14 sm:h-16
                                    text-center
                                    text-xl
                                    font-bold
                                    text-white
                                    bg-[#2D2A40]
                                    border-2
                                    border-transparent
                                    rounded-lg
                                    outline-none
                                    focus:border-[#7C3AED]
                                    transition-all
                                    duration-300
                                "
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-[#7C3AED]
                            text-white
                            font-bold
                            tracking-wide
                            py-3
                            rounded-lg
                            transition-all
                            duration-300
                            hover:brightness-110
                            active:scale-95
                            cursor-pointer
                        "
                    >
                        {verifyBtnText}
                    </button>
                </form>

                {/* Wrong Email */}
                <div className="mt-6 text-center">
                    <p className="text-[#6B6880] text-sm">
                        Wrong email ?
                    </p>

                    <button
                        className="
                            mt-2
                            text-[#7C3AED]
                            font-semibold
                            cursor-pointer
                            hover:underline
                        "
                    >
                        <Link to={"/"}>Change</Link>
                    </button>
                </div>

                {/* Resend */}
                <div className="mt-6 text-center">
                    <p className="text-[#6B6880] text-sm">
                        Didn't receive the code?
                    </p>

                    <button
                        className="
                            mt-2
                            text-[#7C3AED]
                            font-semibold
                            cursor-pointer
                            hover:underline
                        "
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};