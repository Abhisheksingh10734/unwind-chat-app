import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { App } from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from './context/SocketContext.jsx';
import { ChatProvider } from "./context/ChatContext";

createRoot(document.getElementById('root')).render(
    <SocketProvider>
        <AuthProvider>
            <BrowserRouter>
                <ChatProvider>
                    <App />
                </ChatProvider>
            </BrowserRouter>
        </AuthProvider>
    </SocketProvider>
)
