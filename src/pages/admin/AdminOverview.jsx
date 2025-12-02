import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import api from "@/lib/axios";
import { 
    Star, 
    Layers, 
    Map as MapIcon, 
    Store, 
    RotateCcw 
} from "lucide-react";

const COLORS_PIE = ["#10b981", "#f59e0b", "#ef4444"]; // Green, Orange, Red

export default function AdminOverview() {
    const [stats, setStats] = useState({
        productsByCategory: [],
        storesByProvince: [],
        sellerStatus: [],
        totalReviewers: 0,
        activeSellersCount: 0,
        totalCategories: 0,
        totalProvinces: 0,
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            setLoading(true);
            const [categoryRes, provinceRes, statusRes, reviewerRes] =
                await Promise.all([
                    api.get("/dashboard/admin/charts/products-by-category"),
                    api.get("/dashboard/admin/charts/sellers-by-province"),
                    api.get("/dashboard/admin/charts/sellers-status"),
                    api.get("/dashboard/admin/charts/total-reviewers"),
                ]);

            const sellerStatusData = statusRes.data.data || [];
            const activeSeller = sellerStatusData.find(s => s.status === 'active')?.count || 0;
            const categoriesData = categoryRes.data.data || [];
            const provincesData = provinceRes.data.data || [];

            setStats({
                productsByCategory: categoriesData,
                storesByProvince: provincesData,
                sellerStatus: sellerStatusData,
                totalReviewers: reviewerRes.data.data?.count || 0,
                activeSellersCount: activeSeller,
                totalCategories: categoriesData.length,
                totalProvinces: provincesData.length
            });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch admin charts:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-gray-500 font-medium">Memuat data dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Platform Overview</h1>
                <button
                    onClick={fetchChartData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm font-medium"
                >
                    <RotateCcw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Reviewers"
                    value={stats.totalReviewers}
                    icon={<Star className="w-6 h-6 text-blue-600" fill="currentColor" />}
                    iconBg="bg-blue-100"
                />
                <StatCard
                    title="Categories"
                    value={stats.totalCategories}
                    icon={<Layers className="w-6 h-6 text-green-600" />}
                    iconBg="bg-green-100"
                />
                <StatCard
                    title="Provinces"
                    value={stats.totalProvinces}
                    icon={<MapIcon className="w-6 h-6 text-purple-600" />}
                    iconBg="bg-purple-100"
                />
                <StatCard
                    title="Active Sellers"
                    value={stats.activeSellersCount}
                    icon={<Store className="w-6 h-6 text-teal-600" />}
                    iconBg="bg-teal-100"
                />
            </div>

            {/* Row 2: Charts (Bar Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products by Category (Vertical Bar) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                        Produk per Kategori
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.productsByCategory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="category_name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#6b7280'}} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 12, fill: '#6b7280'}} 
                                />
                                <Tooltip 
                                    cursor={{fill: '#f9fafb'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="#10b981" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stores by Province (Horizontal Bar) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                        Toko Berdasarkan Provinsi (Top 10)
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={stats.storesByProvince.slice(0, 10)}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="province_name" 
                                    type="category" 
                                    width={120}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 11, fill: '#6b7280'}}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f9fafb'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="#a855f7" 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={20}
                                    background={{ fill: '#f3f4f6' }}
                                >
                                    {/* Gradient Effect simulation using Cells if needed, sticking to solid purple for clarity based on image */}
                                    {stats.storesByProvince.slice(0, 10).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`rgba(168, 85, 247, ${1 - index * 0.08})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 3: Pie & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Seller Status Distribution (Donut Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                        Distribusi Status Penjual
                    </h2>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.sellerStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                >
                                    {stats.sellerStatus.map((entry, index) => {
                                        let color = "#9ca3af";
                                        if (entry.status === 'active') color = COLORS_PIE[0];
                                        else if (entry.status === 'pending') color = COLORS_PIE[1];
                                        else color = COLORS_PIE[2];
                                        
                                        return <Cell key={`cell-${index}`} fill={color} strokeWidth={0} />;
                                    })}
                                </Pie>
                                <Tooltip />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 font-bold text-xl">
                                    {stats.sellerStatus.reduce((a,b) => a + b.count, 0)}
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="flex justify-center gap-6 mt-4">
                        {stats.sellerStatus.map((entry, index) => {
                             let color = "#9ca3af";
                             if (entry.status === 'active') color = COLORS_PIE[0];
                             else if (entry.status === 'pending') color = COLORS_PIE[1];
                             else color = COLORS_PIE[2];

                             return (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm" style={{backgroundColor: color}}></div>
                                    <span className="text-sm text-gray-600 capitalize">{entry.status}</span>
                                </div>
                             )
                        })}
                    </div>
                </div>

                {/* Platform Statistics (List View) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide">
                        Statistik Platform
                    </h2>
                    
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <span className="text-gray-600 font-medium">Total Kategori</span>
                            <span className="text-gray-900 font-bold text-lg">{stats.totalCategories}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <span className="text-gray-600 font-medium">Total Provinsi Toko</span>
                            <span className="text-gray-900 font-bold text-lg">{stats.totalProvinces}</span>
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <span className="text-gray-600 font-medium">Total Reviewers</span>
                            <span className="text-gray-900 font-bold text-lg">{stats.totalReviewers}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Terakhir Diupdate: {lastUpdated.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen StatCard yang disesuaikan dengan gambar referensi
function StatCard({ title, value, icon, iconBg }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-transform hover:-translate-y-1 duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-3xl font-extrabold text-gray-800">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}