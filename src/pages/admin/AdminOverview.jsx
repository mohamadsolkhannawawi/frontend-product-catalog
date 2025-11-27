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
    Legend,
    ResponsiveContainer,
} from "recharts";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function AdminOverview() {
    const [stats, setStats] = useState({
        productsByCategory: [],
        storesByProvince: [],
        sellerStatus: [],
        totalReviewers: 0,
    });
    const [loading, setLoading] = useState(true);

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

            setStats({
                productsByCategory: categoryRes.data.data || [],
                storesByProvince: provinceRes.data.data || [],
                sellerStatus: statusRes.data.data || [],
                totalReviewers: reviewerRes.data.data?.count || 0,
            });
        } catch (error) {
            console.error("Failed to fetch admin charts:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Platform Overview</h1>
                <button
                    onClick={fetchChartData}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                >
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Reviewers"
                    value={stats.totalReviewers}
                    color="bg-blue-50"
                    textColor="text-blue-600"
                />
                <StatCard
                    title="Categories"
                    value={stats.productsByCategory.length}
                    color="bg-green-50"
                    textColor="text-green-600"
                />
                <StatCard
                    title="Provinces"
                    value={stats.storesByProvince.length}
                    color="bg-purple-50"
                    textColor="text-purple-600"
                />
                <StatCard
                    title="Active Sellers"
                    value={
                        stats.sellerStatus.find((s) => s.status === "active")
                            ?.count || 0
                    }
                    color="bg-emerald-50"
                    textColor="text-emerald-600"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products by Category */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Products by Category
                    </h2>
                    {stats.productsByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.productsByCategory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="category_name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No data available
                        </div>
                    )}
                </div>

                {/* Stores by Province */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Stores by Province (Top 10)
                    </h2>
                    {stats.storesByProvince.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.storesByProvince.slice(0, 10)}
                                    dataKey="count"
                                    nameKey="province_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ percent }) =>
                                        `${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {stats.storesByProvince.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No data available
                        </div>
                    )}
                </div>

                {/* Seller Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Seller Status Distribution
                    </h2>
                    {stats.sellerStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.sellerStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ percent }) =>
                                        `${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {stats.sellerStatus.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No data available
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Platform Statistics
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">
                                Total Categories
                            </span>
                            <span className="font-semibold text-lg">
                                {stats.productsByCategory.length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">
                                Total Provinces with Stores
                            </span>
                            <span className="font-semibold text-lg">
                                {stats.storesByProvince.length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-gray-600">
                                Total Reviewers
                            </span>
                            <span className="font-semibold text-lg">
                                {stats.totalReviewers}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="text-sm text-gray-500">
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color, textColor }) {
    return (
        <div className={`${color} p-6 rounded-lg`}>
            <p className="text-sm text-gray-600 mb-2">{title}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
    );
}
