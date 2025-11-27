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
            label: "Seller Approval",
            icon: <UserCheck className="w-5 h-5" />,
        },
        {
            key: "management",
            label: "Seller Management",
            icon: <Users className="w-5 h-5" />,
        },
        {
            key: "reports",
            label: "Reports",
            icon: <FileText className="w-5 h-5" />,
        },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside
                className={`bg-white border-r transition-all duration-200 flex flex-col h-screen ${
                    collapsed ? "w-20" : "w-64"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">
                            {!collapsed && "Admin"}
                        </div>
                    </div>
                    <button
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={() => setCollapsed((s) => !s)}
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-2">
                    {items.map((it) => (
                        <button
                            key={it.key}
                            onClick={() => setActive(it.key)}
                            className={`w-full flex items-center gap-3 p-3 rounded hover:bg-gray-100 text-left ${
                                active === it.key
                                    ? "bg-gray-100 font-medium"
                                    : ""
                            }`}
                        >
                            <span className="text-brand-primary">
                                {it.icon}
                            </span>
                            {!collapsed && <span>{it.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-3 border-t">
                    <div className="flex flex-col items-stretch">
                        <div className="mb-3">
                            <LogoutButton collapsed={collapsed} />
                        </div>
                        {!collapsed && (
                            <div className="text-sm text-gray-600 text-center">
                                v1.0
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-6">
                {active === "overview" && <AdminOverview />}
                {active === "approval" && <AdminSellers />}
                {active === "management" && <AdminManagement />}
                {active === "reports" && <AdminReports />}
            </main>
        </div>
    );
}

function LogoutButton({ collapsed }) {
    const auth = useAuth();
    const navigate = useNavigate();

    const doLogout = async () => {
        try {
            await auth.logout();
        } finally {
            navigate("/");
        }
    };

    return (
        <button
            onClick={doLogout}
            className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-left text-sm text-gray-700"
        >
            <LogOut className="w-5 h-5 text-red-600" />
            {!collapsed && <span>Logout</span>}
        </button>
    );
}
