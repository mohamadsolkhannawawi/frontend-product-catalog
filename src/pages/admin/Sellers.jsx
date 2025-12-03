import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";
import {
    Search,
    Download,
    Bell,
    Copy,
    Eye,
    Image as ImageIcon,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function AdminSellers() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal & Action States
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedPreviews, setSelectedPreviews] = useState({
        ktp: null,
        pic: null,
    });
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [rejecting, setRejecting] = useState({ open: false, sellerId: null });
    const [reason, setReason] = useState("");

    // Pagination (Client-side for now based on data structure)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const loadPending = async () => {
        setLoading(true);
        try {
            const res = await api.get(API_ENDPOINTS.ADMIN_SELLERS + "/pending");
            setSellers(res.data || res);
        } catch (e) {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, []);

    // Filter Logic
    const filteredSellers = sellers.filter(
        (s) =>
            s.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
    const paginatedSellers = filteredSellers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Actions ---

    const approve = async (id) => {
        if (!confirm("Setujui pendaftaran penjual ini?")) return;
        try {
            await api.post(API_ENDPOINTS.ADMIN_APPROVE_SELLER(id));
            toast.success("Penjual berhasil disetujui");
            loadPending();
        } catch (e) {}
    };

    const doReject = async () => {
        try {
            await api.post(
                `${API_ENDPOINTS.ADMIN_REJECT_SELLER(rejecting.sellerId)}`,
                { reason }
            );
            toast.success("Penjual ditolak");
            setRejecting({ open: false, sellerId: null });
            loadPending();
        } catch (e) {}
    };

    // --- File Handling ---

    const previewFile = async (sellerId, type = "ktp") => {
        try {
            const endpoint =
                type === "ktp"
                    ? API_ENDPOINTS.ADMIN_SELLER_KTP(sellerId)
                    : API_ENDPOINTS.ADMIN_SELLER_PIC(sellerId);

            // Show loading toast
            const toastId = toast.loading("Memuat gambar...");

            const res = await api.get(endpoint, { responseType: "blob" });

            if (imagePreview) URL.revokeObjectURL(imagePreview);
            const url = URL.createObjectURL(res.data);
            setImagePreview(url);

            toast.dismiss(toastId);
        } catch (e) {
            toast.error("Gagal memuat dokumen");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID disalin");
    };

    // --- Details Modal Logic (Simplified for brevity, reusing existing logic) ---
    const fetchBlobUrl = async (sellerId, type = "ktp") => {
        const endpoint =
            type === "ktp"
                ? API_ENDPOINTS.ADMIN_SELLER_KTP(sellerId)
                : API_ENDPOINTS.ADMIN_SELLER_PIC(sellerId);
        const res = await api.get(endpoint, { responseType: "blob" });
        return URL.createObjectURL(res.data);
    };

    const openDetails = async (sellerId) => {
        setDetailsLoading(true);
        try {
            const res = await api.get(
                `${API_ENDPOINTS.ADMIN_SELLERS}/${sellerId}`
            );
            const seller = res.data || res;
            setSelectedSeller(seller);

            const ktpUrl = seller.ktp_file_path
                ? await fetchBlobUrl(seller.seller_id, "ktp")
                : null;
            const picUrl = seller.pic_file_path
                ? await fetchBlobUrl(seller.seller_id, "pic")
                : null;
            setSelectedPreviews({ ktp: ktpUrl, pic: picUrl });
        } catch (e) {
            toast.error("Gagal memuat detail");
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeDetails = () => {
        if (selectedPreviews.ktp) URL.revokeObjectURL(selectedPreviews.ktp);
        if (selectedPreviews.pic) URL.revokeObjectURL(selectedPreviews.pic);
        setSelectedPreviews({ ktp: null, pic: null });
        setSelectedSeller(null);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Persetujuan Penjual
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Tinjau dan verifikasi pendaftaran penjual baru
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm font-medium">
                        <Download className="w-4 h-4" />
                        Ekspor Data
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 transition relative">
                        <Bell className="w-6 h-6" />
                        {sellers.length > 0 && (
                            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-semibold text-gray-700 whitespace-nowrap">
                    Daftar Penjual Pending
                </h3>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari penjual..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-gray-50">
                        <option>Semua Status</option>
                        <option>Pending</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Memuat data...
                    </div>
                ) : filteredSellers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Tidak ada pendaftar pending.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="p-4">ID Registrasi</th>
                                    <th className="p-4">Toko</th>
                                    <th className="p-4">PIC</th>
                                    <th className="p-4">Dokumen</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedSellers.map((seller) => (
                                    <tr
                                        key={seller.seller_id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* ID */}
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-2 group">
                                                <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                    {seller.seller_id.substring(
                                                        0,
                                                        8
                                                    )}
                                                    ...
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            seller.seller_id
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>

                                        {/* TOKO */}
                                        <td className="p-4 align-top">
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm mb-0.5">
                                                    {seller.store_name}
                                                </div>
                                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[180px]">
                                                    {seller.store_description ||
                                                        "Elektronik & Gadget"}
                                                </div>
                                            </div>
                                        </td>

                                        {/* PIC */}
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">
                                                    {seller.user?.name
                                                        ?.substring(0, 2)
                                                        .toUpperCase() || "PIC"}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-sm">
                                                        {seller.user?.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {seller.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DOKUMEN */}
                                        <td className="p-4 align-top">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        previewFile(
                                                            seller.seller_id,
                                                            "ktp"
                                                        )
                                                    }
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-600 text-xs font-medium rounded hover:bg-purple-50 transition"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    Lihat KTP
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        previewFile(
                                                            seller.seller_id,
                                                            "pic"
                                                        )
                                                    }
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-600 text-xs font-medium rounded hover:bg-purple-50 transition"
                                                >
                                                    <ImageIcon className="w-3 h-3" />
                                                    Lihat Foto
                                                </button>
                                            </div>
                                        </td>

                                        {/* AKSI */}
                                        <td className="p-4 align-top">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openDetails(
                                                            seller.seller_id
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded bg-white hover:bg-gray-50 transition"
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        approve(
                                                            seller.seller_id
                                                        )
                                                    }
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded hover:bg-green-600 transition shadow-sm"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Setuju
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRejecting({
                                                            open: true,
                                                            sellerId:
                                                                seller.seller_id,
                                                        });
                                                        setReason("");
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition shadow-sm"
                                                >
                                                    <X className="w-3 h-3" />
                                                    Tolak
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {filteredSellers.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            Menampilkan{" "}
                            <span className="font-medium">
                                {(currentPage - 1) * itemsPerPage + 1}-
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    filteredSellers.length
                                )}
                            </span>{" "}
                            dari{" "}
                            <span className="font-medium">
                                {filteredSellers.length}
                            </span>{" "}
                            penjual pending
                        </p>
                        <div className="flex gap-1">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            >
                                Sebelumnya
                            </button>
                            <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded font-medium">
                                {currentPage}
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODALS (Hidden by default) --- */}

            {/* Image Preview Modal */}
            {imagePreview && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                    }}
                >
                    <div className="bg-white p-2 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full rounded"
                        />
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedSeller && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-bold text-gray-800">
                                Detail Penjual
                            </h3>
                            <button
                                onClick={closeDetails}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {detailsLoading ? (
                                <p>Memuat...</p>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                                Nama Toko
                                            </label>
                                            <p className="text-sm font-medium text-gray-800 mt-1">
                                                {selectedSeller.store_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                                Pemilik
                                            </label>
                                            <p className="text-sm font-medium text-gray-800 mt-1">
                                                {selectedSeller.user?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                                Telepon
                                            </label>
                                            <p className="text-sm font-medium text-gray-800 mt-1">
                                                {selectedSeller.phone}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                                Lokasi
                                            </label>
                                            <p className="text-sm font-medium text-gray-800 mt-1">
                                                {selectedSeller.city?.name},{" "}
                                                {selectedSeller.province?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">
                                            Alamat Lengkap
                                        </label>
                                        <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded border border-gray-100">
                                            {selectedSeller.address} (RT{" "}
                                            {selectedSeller.rt}/RW{" "}
                                            {selectedSeller.rw})
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border rounded-lg p-3">
                                            <p className="text-xs font-semibold mb-2">
                                                KTP
                                            </p>
                                            {selectedPreviews.ktp ? (
                                                <img
                                                    src={selectedPreviews.ktp}
                                                    className="h-32 object-cover rounded"
                                                    alt="KTP"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    Tidak ada gambar
                                                </span>
                                            )}
                                        </div>
                                        <div className="border rounded-lg p-3">
                                            <p className="text-xs font-semibold mb-2">
                                                Foto Diri
                                            </p>
                                            {selectedPreviews.pic ? (
                                                <img
                                                    src={selectedPreviews.pic}
                                                    className="h-32 object-cover rounded"
                                                    alt="PIC"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    Tidak ada gambar
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                            <button
                                onClick={closeDetails}
                                className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejecting.open && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-red-600 mb-4">
                            Tolak Pendaftaran
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Mohon berikan alasan penolakan agar penjual dapat
                            memperbaiki data mereka.
                        </p>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            rows={4}
                            placeholder="Alasan penolakan..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() =>
                                    setRejecting({
                                        open: false,
                                        sellerId: null,
                                    })
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={doReject}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Kirim Penolakan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
