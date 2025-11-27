import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Shield, LogOut, AlertCircle } from "lucide-react";

export default function AdminManagement() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/dashboard/admin/sellers");
            // Handle paginated response
            const data = response.data.data || response.data || [];
            setSellers(data);
        } catch (error) {
            console.error("Failed to fetch sellers:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSellerStatus = async (sellerId, currentStatus) => {
        try {
            await api.patch(
                `/dashboard/admin/sellers/${sellerId}/toggle-status`
            );
            // Update local state
            setSellers(
                sellers.map((s) =>
                    s.seller_id === sellerId
                        ? { ...s, is_active: !currentStatus }
                        : s
                )
            );
        } catch (error) {
            console.error("Failed to toggle seller status:", error);
        }
    };

    const filteredSellers = sellers.filter((seller) => {
        if (filter === "active") return seller.is_active;
        if (filter === "inactive") return !seller.is_active;
        return true;
    });

    if (loading) {
        return <div className="text-center py-8">Loading sellers...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Seller Management</h1>
                <button
                    onClick={fetchSellers}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                >
                    Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 font-medium border-b-2 transition ${
                        filter === "all"
                            ? "border-brand-primary text-brand-primary"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    All ({sellers.length})
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 font-medium border-b-2 transition ${
                        filter === "active"
                            ? "border-brand-primary text-brand-primary"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Active ({sellers.filter((s) => s.is_active).length})
                </button>
                <button
                    onClick={() => setFilter("inactive")}
                    className={`px-4 py-2 font-medium border-b-2 transition ${
                        filter === "inactive"
                            ? "border-brand-primary text-brand-primary"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Inactive ({sellers.filter((s) => !s.is_active).length})
                </button>
            </div>

            {/* Sellers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {filteredSellers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        No sellers found
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Store Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Province
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Last Upload
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredSellers.map((seller) => (
                                <tr
                                    key={seller.seller_id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {seller.store_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {seller.user?.email || "N/A"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {seller.province?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {seller.phone || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {seller.updated_at
                                            ? new Date(
                                                  seller.updated_at
                                              ).toLocaleDateString()
                                            : "Never"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                seller.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {seller.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() =>
                                                toggleSellerStatus(
                                                    seller.seller_id,
                                                    seller.is_active
                                                )
                                            }
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition ${
                                                seller.is_active
                                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                    : "bg-green-100 text-green-600 hover:bg-green-200"
                                            }`}
                                        >
                                            {seller.is_active ? (
                                                <>
                                                    <LogOut className="w-4 h-4" />
                                                    Deactivate
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-4 h-4" />
                                                    Activate
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
