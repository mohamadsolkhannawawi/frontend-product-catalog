import React from "react";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { FeedbackProvider } from "@/context/FeedbackContext";
import "./App.css";

export default function App() {
    return (
        <FeedbackProvider>
            <AppRoutes />
            <Toaster position="top-right" />
        </FeedbackProvider>
    );
}
