import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/common/Input";
import { useState } from "react";

const Navbar = () => {
    const isLoggedIn = false; // Replace with actual auth state
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
            e.preventDefault();
            if (searchQuery.trim()) {
                navigate(
                    `/catalog?q=${encodeURIComponent(searchQuery.trim())}`
                );
            }
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                            Catalozy
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={handleSearch}
                            />
                            <Input
                                type="text"
                                placeholder="Apa yang Anda cari hari ini?"
                                className="w-full pl-12 pr-4 rounded-full border border-gray-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right Menu (only essentials) */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <User className="h-5 w-5 text-gray-600" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="btn-ghost px-4 py-2 rounded-sm text-sm"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-secondary px-4 py-2 rounded-sm text-sm"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
