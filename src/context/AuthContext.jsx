import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("auth_user");
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    });

    // NOTE:
    // We intentionally do NOT auto-fetch `/me` on provider mount to avoid
    // repeated background requests during app initialization. Instead,
    // callers (e.g. Login) should call `setAuthUser(...)` after a successful
    // login or explicitly fetch `/me` when needed.

    function setAuthUser(u) {
        setUser(u);
        try {
            if (u) {
                localStorage.setItem("auth_user", JSON.stringify(u));
            } else {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("auth_token");
            }
        } catch (e) {}
    }

    async function logout() {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            // ignore server errors but still clear client state
        }
        // Clear token and user
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setAuthUser(null);
        toast.success("Berhasil keluar");
    }

    return (
        <AuthContext.Provider
            value={{ user, setAuthUser, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
