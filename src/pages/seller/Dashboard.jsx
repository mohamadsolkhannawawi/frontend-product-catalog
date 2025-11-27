import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import Loader from "@/components/common/Loader";
import StatCard from "@/components/features/seller/StatCard";
import StockChart from "@/components/features/seller/StockChart";
import RatingChart from "@/components/features/seller/RatingChart";
import ProvinceChart from "@/components/features/seller/ProvinceChart";
import SellerProducts from "@/pages/seller/SellerProducts";
import SellerReports from "@/pages/seller/Reports";
import { Menu, Home, Box, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard({ initialActive = "overview" }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [ratingData, setRatingData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(initialActive);
    useEffect(() => {
        setActive(initialActive);
    }, [initialActive]);
    const navigate = useNavigate();

    const items = [
        {
            key: "overview",
            label: "Overview",
            icon: <Home className="w-5 h-5" />,
        },
        {
            key: "products",
            label: "Kelola Produk",
            icon: <Box className="w-5 h-5" />,
        },
        {
            key: "reports",
            label: "Laporan",
            icon: <FileText className="w-5 h-5" />,
        },
    ];

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [
                    resStats,
                    resProducts,
                    resStock,
                    resRating,
                    resProvince,
                ] = await Promise.all([
                    api.get("/dashboard/seller/overview"),
                    api.get("/dashboard/seller/products"),
                    api.get("/dashboard/seller/charts/stock-per-product"),
                    api.get("/dashboard/seller/charts/rating-per-product"),
                    api.get("/dashboard/seller/charts/reviewers-by-province"),
                ]);

                if (mounted) {
                    setStats(resStats.data || resStats);
                    setProducts(resProducts.data || resProducts);
                    setStockData(resStock.data || []);
                    setRatingData(resRating.data || []);
                    setProvinceData(resProvince.data || []);
                }
            } catch (e) {
                // handled by axios interceptor toast
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => (mounted = false);
    }, []);

    if (loading) return <Loader />;

    const navigateToKey = (key) => {
        if (key === "overview") navigate("/seller/dashboard");
        else if (key === "products") navigate("/seller/products");
        else if (key === "reports") navigate("/seller/reports");
        else setActive(key);
    };

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
                            {!collapsed && "Seller"}
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
                            onClick={() => navigateToKey(it.key)}
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
                            <SellerLogout collapsed={collapsed} />
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
                {active === "overview" && (
                    <div>
                        <h1 className="text-2xl font-semibold mb-4">
                            Seller Overview
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard
                                title="Total Products"
                                value={stats?.product_count ?? 0}
                            />
                            <StatCard
                                title="Total Reviews"
                                value={stats?.review_count ?? 0}
                            />
                            <StatCard
                                title="Average Rating"
                                value={stats?.average_rating ?? 0}
                            />
                            <StatCard
                                title="Positive %"
                                value={`${stats?.positive_percentage ?? 0}%`}
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card">
                                <h3 className="font-semibold mb-2">
                                    📊 Sebaran Stok Per Produk
                                </h3>
                                <StockChart data={stockData} />
                            </div>

                            <div className="card">
                                <h3 className="font-semibold mb-2">
                                    ⭐ Sebaran Rating Per Produk
                                </h3>
                                <RatingChart data={ratingData} />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4">
                            <div className="card">
                                <h3 className="font-semibold mb-2">
                                    🗺️ Sebaran Lokasi Pemberi Rating (Provinsi)
                                </h3>
                                <ProvinceChart data={provinceData} />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card">
                                <h3 className="font-semibold">
                                    Latest Products
                                </h3>
                                <ul className="mt-3 space-y-2">
                                    {(stats?.latest_products || []).map((p) => (
                                        <li
                                            key={p.product_id}
                                            className="flex items-center justify-between"
                                        >
                                            <div>{p.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(
                                                    p.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {active === "products" && (
                    <div>
                        <h1 className="text-2xl font-semibold mb-4">
                            Kelola Produk
                        </h1>
                        <SellerProducts />
                    </div>
                )}

                {active === "reports" && <SellerReports />}
            </main>
        </div>
    );
}

function SellerLogout({ collapsed }) {
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
