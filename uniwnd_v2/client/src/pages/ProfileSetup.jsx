import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const ProfileSetup = () => {
    const [displayName, setDisplayName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const {state} = useLocation();

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            displayName,
            profileImage,
        });
    };

    const handleSkip = () => {
        console.log("Skipped profile setup");
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
                        Add a profile picture and your display name
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
                                    w-32 h-32
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
                                {profileImage ? (
                                    <img
                                        src={profileImage}
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
                                setDisplayName(e.target.value)
                            }
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
                            disabled={!displayName.trim()}
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
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};