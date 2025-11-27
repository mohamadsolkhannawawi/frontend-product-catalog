import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/common/Input";
import { Search, Bell, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    function onSearch(e) {
        e.preventDefault();
        navigate(`/catalog?q=${encodeURIComponent(q)}`);
    }

    const auth = useAuth();

    function onLogout() {
        auth.logout();
        navigate("/");
    }

    return (
        <nav className="bg-white border-b border-brand-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-lg font-bold text-brand-black">
                        Catalog
                    </Link>
                    <span className="text-sm text-brand-gray-500">
                        Categories
                    </span>
                </div>

                <form onSubmit={onSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-brand-gray-500" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari produk, toko, atau kategori..."
                            className="pl-10 rounded-full h-11"
                        />
                    </div>
                </form>

                <div className="flex items-center gap-3">
                    {auth?.isAuthenticated ? (
                        <>
                            <span className="text-sm text-brand-gray-700">
                                {auth.user?.name || auth.user?.email}
                            </span>
                            {(() => {
                                const role = auth.user?.role;
                                const dash =
                                    role === "admin"
                                        ? "/admin/dashboard"
                                        : role === "seller"
                                        ? "/seller/dashboard"
                                        : null;
                                return dash ? (
                                    <Link to={dash} className="btn-primary">
                                        Dashboard
                                    </Link>
                                ) : null;
                            })()}
                            <button
                                onClick={onLogout}
                                className="btn-secondary"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary">
                                Register
                            </Link>
                        </>
                    )}
                    <Bell className="w-5 h-5 text-brand-gray-500" />
                    <User className="w-6 h-6 text-brand-gray-500" />
                </div>
            </div>
        </nav>
    );
}
