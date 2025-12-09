import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/common/Input";
import { useState } from "react";
import logo from "@/assets/images/logo/logo-catalozy.svg";

const Navbar = () => {
    const isLoggedIn = false; // replace with actual auth
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
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200/70 py-3">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Catalozy" className="h-8 w-auto" />
                        <span className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                            Catalozy
                        </span>
                    </Link>

                    {/* SEARCH BAR (CENTER) */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                onClick={handleSearch}
                            />
                            <Input
                                type="text"
                                placeholder="Cari produk terbaik hari ini..."
                                className="w-full h-12 pl-14 pr-4 rounded-full border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* MENU KANAN */}
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <button className="p-2 hover:bg-gray-100 rounded-sm transition">
                                    <User className="h-5 w-5 text-gray-600" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 text-sm font-medium hover:text-gray-800"
                                >
                                    Masuk
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-5 py-2 rounded-sm bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
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
