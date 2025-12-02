import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSellers from "@/pages/admin/Sellers";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminManagement from "@/pages/admin/AdminManagement";
import AdminReports from "@/pages/admin/AdminReports";
import {
    Menu,
    UserCheck,
    Users,
    LogOut,
    BarChart3,
    FileText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard({ initialActive = "overview" }) {
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(initialActive);

    const items = [
        {
            key: "overview",
            label: "Overview",
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            key: "approval",
            label: "Persetujuan Penjual",
            icon: <UserCheck className="w-5 h-5" />,
        },
        {
            key: "management",
            label: "Manajemen Penjual",
            icon: <Users className="w-5 h-5" />,
        },
        {
            key: "reports",
            label: "Laporan",
            icon: <FileText className="w-5 h-5" />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* SIDEBAR (FIXED POSITION) */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30 ${
                    collapsed ? "w-20" : "w-64"
                }`}
            >
                {/* Header Sidebar */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div className={`flex items-center gap-2 overflow-hidden ${collapsed ? "hidden" : "block"}`}>
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight">
                            Admin<span className="text-purple-600">Panel</span>
                        </span>
                    </div>
                    <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        onClick={() => setCollapsed((s) => !s)}
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {items.map((it) => {
                        const isActive = active === it.key;
                        return (
                            <button
                                key={it.key}
                                onClick={() => setActive(it.key)}
                                className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-purple-50 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-700 rounded-r-full" />
                                )}

                                <span className={`transition-colors ${isActive ? "text-purple-700" : "text-gray-400 group-hover:text-gray-600"}`}>
                                    {it.icon}
                                </span>
                                
                                {!collapsed && (
                                    <span className="truncate">{it.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer / Logout Button */}
                <div className="p-4 border-t border-gray-100 bg-white mt-auto shrink-0">
                    <div className="flex flex-col items-stretch">
                        <div className="mb-2">
                            <LogoutButton collapsed={collapsed} />
                        </div>
                        {!collapsed && (
                            <div className="text-xs text-gray-400 text-center mt-2">
                                © 2025 Catalozy Admin
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main 
                className={`min-h-screen p-8 transition-all duration-300 ${
                    collapsed ? "ml-20" : "ml-64"
                }`}
            >
                <div className="max-w-7xl mx-auto">
                    {active === "overview" && <AdminOverview />}
                    {active === "approval" && <AdminSellers />}
                    {active === "management" && <AdminManagement />}
                    {active === "reports" && <AdminReports />}
                </div>
            </main>
        </div>
    );
}

function LogoutButton({ collapsed }) {
    const auth = useAuth();
    const navigate = useNavigate();

    const doLogout = async () => {
        if(confirm("Apakah Anda yakin ingin keluar?")) {
            try {
                await auth.logout();
            } finally {
                navigate("/");
            }
        }
    };

    return (
        <button
            onClick={doLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50 ${
                collapsed ? "justify-center" : ""
            }`}
            title="Logout"
        >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
        </button>
    );
}