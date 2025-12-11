import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import Loader, { BarsSpinner } from "@/components/common/Loader";
import SellerProducts from "@/pages/seller/SellerProducts";
import SellerReports from "@/pages/seller/Reports";
import {
    Menu,
    Home,
    Box,
    FileText,
    LogOut,
    ShoppingBag,
    MessageCircle,
    Star,
    TrendingUp,
    RotateCcw,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { useFeedback } from "@/context/FeedbackContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from "recharts";

export default function Dashboard({ initialActive = "overview" }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [ratingData, setRatingData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(initialActive);
    const [lastUpdated, setLastUpdated] = useState(new Date());

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

    // Helper: Mengolah data produk menjadi distribusi rating 1-5 bintang
    // Menjumlahkan 'total_reviews' agar diagram merefleksikan jumlah ulasan, bukan jumlah produk
    const processRatingDistribution = (productList) => {
        if (!Array.isArray(productList)) return [];

        const distribution = [
            { rating: 1, count: 0 },
            { rating: 2, count: 0 },
            { rating: 3, count: 0 },
            { rating: 4, count: 0 },
            { rating: 5, count: 0 },
        ];

        productList.forEach((item) => {
            // Ambil rating rata-rata produk, fallback ke 0
            const ratingVal = parseFloat(item.avg_rating || item.rating || 0);
            // Ambil jumlah ulasan untuk produk ini (penting agar total chart sesuai total ulasan)
            const reviewCount = parseInt(item.total_reviews || 0);

            // Bulatkan ke bintang terdekat (misal 4.7 -> 5)
            const rounded = Math.round(ratingVal);

            if (rounded >= 1 && rounded <= 5) {
                // Tambahkan jumlah ulasan ke bucket yang sesuai
                distribution[rounded - 1].count += reviewCount;
            }
        });

        return distribution;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resStats, resProducts, resStock, resRating, resProvince] =
                await Promise.all([
                    api.get("/dashboard/seller/overview"),
                    api.get("/dashboard/seller/products"),
                    api.get("/dashboard/seller/charts/stock-per-product"),
                    api.get("/dashboard/seller/charts/rating-per-product"),
                    api.get("/dashboard/seller/charts/reviewers-by-province"),
                ]);

            setStats(resStats.data || resStats);
            setProducts(resProducts.data || resProducts);
            setStockData(resStock.data || []);

            // PERBAIKAN 1: Proses data rating sebelum disimpan ke state
            const rawRatingData = resRating.data || [];
            const processedRating = processRatingDistribution(rawRatingData);
            setRatingData(processedRating);

            // PERBAIKAN 2: Transform province data untuk match dengan chart expectation
            const rawProvinceData = resProvince.data || [];
            console.log("Raw Province Data:", rawProvinceData);
            const transformedProvinceData = rawProvinceData.map((item) => ({
                province:
                    item.province_name || item.province || "Tidak Diketahui",
                count: item.total || item.count || 0,
            }));
            console.log("Transformed Province Data:", transformedProvinceData);
            setProvinceData(transformedProvinceData);
            setLastUpdated(new Date());
        } catch (e) {
            console.error("Failed to load dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const navigateToKey = (key) => {
        if (key === "overview") navigate("/seller/dashboard");
        else if (key === "products") navigate("/seller/products");
        else if (key === "reports") navigate("/seller/reports");
        else setActive(key);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30 ${
                    collapsed ? "w-20" : "w-64"
                }`}
            >
                {/* Header Sidebar */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                    <div
                        className={`flex items-center gap-2 overflow-hidden ${
                            collapsed ? "hidden" : "block"
                        }`}
                    >
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight">
                            Seller<span className="text-purple-600">Panel</span>
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
                                onClick={() => navigateToKey(it.key)}
                                className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-purple-50 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-700 rounded-r-full" />
                                )}
                                <span
                                    className={`transition-colors ${
                                        isActive
                                            ? "text-purple-700"
                                            : "text-gray-400 group-hover:text-gray-600"
                                    }`}
                                >
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
                            <SellerLogout collapsed={collapsed} />
                        </div>
                        {!collapsed && (
                            <div className="text-xs text-gray-400 text-center mt-2">
                                © 2025 Catalozy Seller
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
                    {active === "overview" && (
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Seller Overview
                                </h1>
                                <button
                                    onClick={fetchData}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm font-medium"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Refresh
                                </button>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Produk"
                                    value={stats?.product_count ?? 0}
                                    icon={
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    }
                                    iconBg="bg-blue-100"
                                />
                                <StatCard
                                    title="Total Ulasan"
                                    value={stats?.review_count ?? 0}
                                    icon={
                                        <MessageCircle className="w-6 h-6 text-orange-600" />
                                    }
                                    iconBg="bg-orange-100"
                                />
                                <StatCard
                                    title="Rating Rata-rata"
                                    value={stats?.average_rating ?? 0}
                                    icon={
                                        <Star
                                            className="w-6 h-6 text-yellow-600"
                                            fill="currentColor"
                                        />
                                    }
                                    iconBg="bg-yellow-100"
                                />
                                <StatCard
                                    title="Sentimen Positif"
                                    value={`${
                                        stats?.positive_percentage ?? 0
                                    }%`}
                                    icon={
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    }
                                    iconBg="bg-green-100"
                                />
                            </div>

                            {/* Charts Row 1 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Stock Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                                        Sebaran Stok Produk
                                    </h2>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart data={stockData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#f3f4f6"
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: "#6b7280",
                                                    }}
                                                    interval={0}
                                                    tickFormatter={(val) =>
                                                        val.length > 10
                                                            ? `${val.substring(
                                                                  0,
                                                                  10
                                                              )}...`
                                                            : val
                                                    }
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#6b7280",
                                                    }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: "#f9fafb" }}
                                                    contentStyle={{
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="stock"
                                                    fill="#0ea5e9"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={40}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Rating Distribution */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                                        Distribusi Rating Produk
                                    </h2>
                                    <div className="h-[300px] w-full flex items-center justify-center">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={ratingData}
                                                    dataKey="count"
                                                    nameKey="rating"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                >
                                                    {ratingData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    [
                                                                        "#ef4444",
                                                                        "#f97316",
                                                                        "#eab308",
                                                                        "#84cc16",
                                                                        "#22c55e",
                                                                    ][
                                                                        entry.rating -
                                                                            1
                                                                    ] ||
                                                                    "#cbd5e1"
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-3 mt-4 flex-wrap">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                                key={star}
                                                className="flex items-center gap-1"
                                            >
                                                <div
                                                    className={`w-3 h-3 rounded-full`}
                                                    style={{
                                                        backgroundColor: [
                                                            "#ef4444",
                                                            "#f97316",
                                                            "#eab308",
                                                            "#84cc16",
                                                            "#22c55e",
                                                        ][star - 1],
                                                    }}
                                                ></div>
                                                <span className="text-xs text-gray-600">
                                                    {star} Bintang
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Province & Latest Products */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Province Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                                        Demografi Reviewer (Provinsi)
                                    </h2>
                                    <div className="h-[300px] w-full">
                                        {provinceData &&
                                        provinceData.length > 0 ? (
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    layout="vertical"
                                                    data={provinceData.slice(
                                                        0,
                                                        5
                                                    )}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 40,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        horizontal={false}
                                                        stroke="#f3f4f6"
                                                    />
                                                    <XAxis type="number" hide />
                                                    <YAxis
                                                        dataKey="province"
                                                        type="category"
                                                        width={100}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: "#6b7280",
                                                        }}
                                                    />
                                                    <Tooltip
                                                        cursor={{
                                                            fill: "#f9fafb",
                                                        }}
                                                        contentStyle={{
                                                            borderRadius: "8px",
                                                            border: "none",
                                                            boxShadow:
                                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="count"
                                                        fill="#8b5cf6"
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={20}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <p className="text-sm">
                                                    Belum ada data reviewer dari
                                                    provinsi
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Latest Products List */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                                        Produk Terbaru Ditambahkan
                                    </h2>

                                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[240px] custom-scrollbar pr-2">
                                        {(stats?.latest_products || []).length >
                                        0 ? (
                                            (stats?.latest_products || []).map(
                                                (p) => {
                                                    // PERBAIKAN 2: Cross-reference data produk untuk mendapatkan stock & price yang benar
                                                    const productsArray =
                                                        Array.isArray(products)
                                                            ? products
                                                            : products?.data ||
                                                              [];
                                                    const fullProduct =
                                                        productsArray.find(
                                                            (item) =>
                                                                item.product_id ===
                                                                p.product_id
                                                        );

                                                    // Gunakan data dari fullProduct jika ada, jika tidak gunakan p, fallback ke 0
                                                    const displayStock =
                                                        fullProduct?.stock ??
                                                        p.stock ??
                                                        0;
                                                    const displayPrice =
                                                        fullProduct?.price ??
                                                        p.price ??
                                                        0;

                                                    return (
                                                        <div
                                                            key={p.product_id}
                                                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                                    <Box className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                                        {p.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Stok:{" "}
                                                                        <span className="font-medium text-gray-700">
                                                                            {
                                                                                displayStock
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                                Rp{" "}
                                                                {parseInt(
                                                                    displayPrice
                                                                ).toLocaleString(
                                                                    "id-ID"
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <p className="text-sm text-gray-400 text-center py-4">
                                                Belum ada produk.
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            Terakhir Diupdate:{" "}
                                            {lastUpdated.toLocaleTimeString(
                                                "id-ID",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {active === "products" && (
                        <div>
                            <SellerProducts />
                        </div>
                    )}

                    {active === "reports" && <SellerReports />}
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, iconBg }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-transform hover:-translate-y-1 duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-extrabold text-gray-800">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
            </div>
        </div>
    );
}

function SellerLogout({ collapsed }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const { showConfirmation } = useFeedback();
    const [loggingOut, setLoggingOut] = React.useState(false);

    const doLogout = () => {
        showConfirmation({
            title: "Konfirmasi Logout",
            message: "Anda akan keluar dari sesi ini.",
            confirmText: "Keluar",
            cancelText: "Batal",
            isDangerous: false,
            onConfirm: async () => {
                setLoggingOut(true);
                try {
                    await auth.logout();
                    navigate("/");
                } finally {
                    setLoggingOut(false);
                }
            },
        });
    };

    return (
        <>
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

            {loggingOut &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                        <div className="text-brand-purple">
                            <BarsSpinner size={96} />
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
