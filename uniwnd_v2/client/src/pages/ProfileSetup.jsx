import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export const ProfileSetup = () => {
    const [displayName, setDisplayName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitBtnText, setSubmitBtnText] = useState("Continue");

    const { state } = useLocation();
    const navigate = useNavigate();

    const userEmail = state?.email;

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!userEmail) {
            toast.error(
                "It looks like you are not signed up yet! Please signup first."
            );
            navigate("/auth/chats");
        }
    }, [userEmail, navigate]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image.");
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!displayName.trim()) {
            toast.error("Please enter a display name.");
            return;
        }

        try {
            setSubmitBtnText("Creating Profile...");

            const formData = new FormData();

            formData.append("username", displayName.trim());
            formData.append("email", userEmail);

            if (profileImage) {
                formData.append("avatar", profileImage);
            }

            const res = await api.post(
                "/api/auth/profile/setup",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                toast.success(
                    res.data.message || "Profile created successfully!"
                );

                navigate("/dashboard");
            } else {
                toast.error(
                    res.data.message || "Failed to create profile."
                );
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    "Internal server error"
            );
        } finally {
            setSubmitBtnText("Continue");
        }
    };

    const handleSkip = async () => {
        try {
            setSubmitBtnText("Skipping...");

            const res = await api.post(
                "/api/auth/profile/setup",
                {
                    username: displayName || "Anonymous",
                    email: userEmail,
                    avatar: null,
                }
            );

            if (res.data.success) {
                toast.success("Profile setup skipped.");
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    "Something went wrong."
            );
        } finally {
            setSubmitBtnText("Continue");
        }
    };

    return (
        <div className="min-h-screen bg-[#16132A] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#1E1B2E] border border-[#2D2A40] rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Complete Your{" "}
                        <span className="text-[#7C3AED]">
                            Profile
                        </span>
                    </h1>

                    <p className="text-[#6B6880] mt-2">
                        Add a profile picture and your display
                        name
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
                    {/* Profile Image */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div
                                className="
                                    w-32
                                    h-32
                                    rounded-full
                                    overflow-hidden
                                    border-4
                                    border-[#7C3AED]
                                    bg-[#2D2A40]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-5xl text-[#6B6880]">
                                        👤
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="
                                    absolute
                                    bottom-1
                                    right-1
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-[#7C3AED]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    hover:brightness-110
                                    transition
                                    cursor-pointer
                                "
                            >
                                📷
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                            Display Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your display name"
                            value={displayName}
                            onChange={(e) =>
                                setDisplayName(
                                    e.target.value
                                )
                            }
                            maxLength={30}
                            className="
                                w-full
                                bg-[#2D2A40]
                                text-white
                                placeholder:text-[#6B6880]
                                px-4
                                py-3
                                rounded-lg
                                outline-none
                                border-2
                                border-transparent
                                focus:border-[#7C3AED]
                                transition-all
                            "
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="
                                flex-1
                                bg-[#2D2A40]
                                text-white
                                py-3
                                rounded-lg
                                font-semibold
                                hover:bg-[#6B6880]
                                transition-all
                                cursor-pointer
                            "
                        >
                            Skip
                        </button>

                        <button
                            type="submit"
                            disabled={
                                !displayName.trim() ||
                                submitBtnText !==
                                    "Continue"
                            }
                            className="
                                flex-1
                                bg-[#7C3AED]
                                text-white
                                py-3
                                rounded-lg
                                font-bold
                                hover:brightness-110
                                transition-all
                                active:scale-95
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                cursor-pointer
                            "
                        >
                            {submitBtnText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;