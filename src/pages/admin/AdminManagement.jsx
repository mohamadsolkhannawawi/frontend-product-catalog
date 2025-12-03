import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
    Bell,
    Mail,
    Ban,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Loader,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminManagement() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, active, inactive

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/dashboard/admin/sellers");
            const data = response.data.data || response.data || [];
            setSellers(data);
        } catch (error) {
            console.error("Failed to fetch sellers:", error);
            toast.error("Gagal memuat data seller");
        } finally {
            setLoading(false);
        }
    };

    const toggleSellerStatus = async (sellerId, currentStatus) => {
        const action = currentStatus ? "menonaktifkan" : "mengaktifkan";
        if (!confirm(`Apakah Anda yakin ingin ${action} toko ini?`)) return;

        try {
            await api.patch(
                `/dashboard/admin/sellers/${sellerId}/toggle-status`
            );

            // Update local state optimistically
            setSellers((prev) =>
                prev.map((s) =>
                    s.seller_id === sellerId
                        ? { ...s, is_active: !currentStatus }
                        : s
                )
            );

            toast.success(`Berhasil ${action} toko`);
        } catch (error) {
            console.error("Failed to toggle seller status:", error);
            toast.error("Gagal mengubah status");
        }
    };

    // --- Filtering Logic ---
    const getFilteredSellers = () => {
        if (filter === "active") return sellers.filter((s) => s.is_active);
        if (filter === "inactive") return sellers.filter((s) => !s.is_active);
        return sellers;
    };

    const filteredData = getFilteredSellers();

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Format Date Helper ---
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Counts for tabs
    const counts = {
        all: sellers.length,
        active: sellers.filter((s) => s.is_active).length,
        inactive: sellers.filter((s) => !s.is_active).length,
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manajemen Penjual
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Pantau aktivitas dan status toko yang terdaftar di
                        platform.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                        <Mail className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 pt-2">
                    <button
                        onClick={() => {
                            setFilter("all");
                            setCurrentPage(1);
                        }}
                        className={`py-2 pb-4 px-4 text-sm font-semibold transition-all border-b-2 ${
                            filter === "all"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Semua ({counts.all})
                    </button>
                    <button
                        onClick={() => {
                            setFilter("active");
                            setCurrentPage(1);
                        }}
                        className={`py-2 pb-4 px-4 text-sm font-semibold transition-all border-b-2 ${
                            filter === "active"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Aktif ({counts.active})
                    </button>
                    <button
                        onClick={() => {
                            setFilter("inactive");
                            setCurrentPage(1);
                        }}
                        className={`py-2 pb-4 px-4 text-sm font-semibold transition-all border-b-2 ${
                            filter === "inactive"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Tidak Aktif ({counts.inactive})
                    </button>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-x-auto">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-gray-500 gap-2">
                            <Loader className="animate-spin w-5 h-5" /> Memuat
                            data...
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            Tidak ada data penjual.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Nama Toko
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Provinsi
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        No. Telepon
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Upload Terakhir
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedData.map((seller) => (
                                    <tr
                                        key={seller.seller_id}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 align-middle">
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">
                                                    {seller.store_name}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {seller.user?.email ||
                                                        "No Email"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-sm text-gray-600">
                                            {seller.province?.name || "-"}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-sm text-gray-600">
                                            {seller.phone || "-"}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-sm text-gray-600">
                                            {formatDate(seller.updated_at)}
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                                                    seller.is_active
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                {seller.is_active
                                                    ? "Aktif"
                                                    : "Tidak Aktif"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <button
                                                onClick={() =>
                                                    toggleSellerStatus(
                                                        seller.seller_id,
                                                        seller.is_active
                                                    )
                                                }
                                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-xs font-medium transition shadow-sm ${
                                                    seller.is_active
                                                        ? "border-red-200 text-red-500 hover:bg-red-50"
                                                        : "border-green-200 text-green-600 hover:bg-green-50"
                                                }`}
                                            >
                                                {seller.is_active ? (
                                                    <>
                                                        <Ban className="w-3.5 h-3.5" />
                                                        Nonaktifkan
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Aktifkan
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

                {/* Pagination Footer */}
                {filteredData.length > 0 && (
                    <div className="border-t border-gray-100 p-4 bg-white flex items-center justify-between mt-auto">
                        <p className="text-xs text-gray-500">
                            Menampilkan{" "}
                            <span className="font-bold text-gray-700">
                                {(currentPage - 1) * itemsPerPage + 1}-
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    filteredData.length
                                )}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold text-gray-700">
                                {filteredData.length}
                            </span>{" "}
                            penjual
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Simple Page Indicator */}
                            <button className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-md text-xs font-medium shadow-sm">
                                {currentPage}
                            </button>

                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
