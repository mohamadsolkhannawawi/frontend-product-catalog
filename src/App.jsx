import React from "react";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./App.css";

export default function App() {
    return (
        <>
            <AppRoutes />
            <Toaster position="top-right" />
        </>
    );
}
