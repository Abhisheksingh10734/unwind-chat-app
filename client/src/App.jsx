import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Otp } from "./pages/Otp";
import { Signup } from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import { AuthLoader } from "./components/AuthLoader";
import { UserChat } from "./pages/UserChat";

import { ProtectedRoute } from "./components/ProtectedRoute";

export const App = () => {

    return (
        <div className="w-full h-screen bg-[#1E1B2E] text-white">

          <AuthLoader />

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />

            <Routes>

                <Route
                    path="/"
                    element={<Signup />}
                />

                <Route
                    path="/otp"
                    element={<Otp />}
                />

                <Route
                    path="/chats"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chats/:id/:email"
                    element={
                        <ProtectedRoute>
                            <UserChat />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </div>
    );
};