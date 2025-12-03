import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Import createPortal untuk solusi layar full
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";
import { 
    Search, 
    Eye, 
    Image as ImageIcon, 
    Check, 
    X, 
    ChevronLeft, 
    ChevronRight,
    Loader
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

    // Pagination
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

    // --- Details Modal Logic ---
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
            
            {/* Header & Search Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-left w-full md:w-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Persetujuan Penjual</h1>
                    <p className="text-gray-500 text-sm mt-1">Tinjau dan verifikasi pendaftaran penjual baru</p>
                </div>

                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Cari penjual..." 
                            className="w-full pl-9 pr-4 py-1.5 text-sm bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center items-center text-gray-500">
                        <Loader className="animate-spin mr-2 w-5 h-5" /> Memuat data...
                    </div>
                ) : filteredSellers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Tidak ada pendaftar pending.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="p-4 w-16">No</th>
                                    <th className="p-4">Toko</th>
                                    <th className="p-4">PIC</th>
                                    <th className="p-4">Dokumen</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedSellers.map((seller, index) => (
                                    <tr key={seller.seller_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 align-top text-sm text-gray-600 font-medium">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
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
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="font-bold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredSellers.length)}</span> dari <span className="font-bold text-gray-700">{filteredSellers.length}</span> penjual pending
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
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

            {/* --- MODALS (Menggunakan CreatePortal agar FULL SCREEN & TOP Z-INDEX) --- */}

            {/* Image Preview Modal */}
            {imagePreview && createPortal(
                <div 
                    className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                    }}
                >
                    <div className="relative bg-transparent max-w-4xl max-h-[90vh]">
                        <img src={imagePreview} alt="Preview" className="max-w-full max-h-[90vh] rounded shadow-2xl" />
                        <button className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-1.5 shadow hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* Detail Modal */}
            {selectedSeller && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 max-h-[90vh] flex flex-col">
                        
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
                            <h3 className="text-lg font-bold text-gray-900">Detail Penjual</h3>
                            <button 
                                onClick={closeDetails}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {detailsLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader className="animate-spin text-purple-600 w-8 h-8" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nama Toko</label>
                                            <p className="text-sm font-semibold text-gray-900">{selectedSeller.store_name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pemilik</label>
                                            <p className="text-sm font-semibold text-gray-900">{selectedSeller.user?.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Telepon</label>
                                            <p className="text-sm font-semibold text-gray-900">{selectedSeller.phone}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lokasi</label>
                                            <p className="text-sm font-semibold text-gray-900 uppercase">
                                                {selectedSeller.city?.name ? `${selectedSeller.city.name}, ${selectedSeller.province?.name}` : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                                        <div className="p-3.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 leading-relaxed">
                                            {selectedSeller.address} 
                                            {selectedSeller.rt ? ` (RT ${selectedSeller.rt}/RW ${selectedSeller.rw})` : ''}
                                            {selectedSeller.village ? `, ${selectedSeller.village.name}` : ''}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="border border-gray-200 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Foto KTP</span>
                                                {selectedPreviews.ktp && (
                                                    <button 
                                                        onClick={() => previewFile(selectedSeller.seller_id, 'ktp')} 
                                                        className="text-xs text-purple-600 font-medium hover:underline flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" /> Lihat
                                                    </button>
                                                )}
                                            </div>
                                            <div className="bg-gray-100 rounded-md h-32 w-full overflow-hidden flex items-center justify-center relative">
                                                {selectedPreviews.ktp ? (
                                                    <img src={selectedPreviews.ktp} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" onClick={() => previewFile(selectedSeller.seller_id, 'ktp')} alt="KTP" />
                                                ) : <span className="text-xs text-gray-400 italic">Tidak ada gambar</span>}
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Foto Diri</span>
                                                {selectedPreviews.pic && (
                                                    <button 
                                                        onClick={() => previewFile(selectedSeller.seller_id, 'pic')} 
                                                        className="text-xs text-purple-600 font-medium hover:underline flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" /> Lihat
                                                    </button>
                                                )}
                                            </div>
                                            <div className="bg-gray-100 rounded-md h-32 w-full overflow-hidden flex items-center justify-center relative">
                                                {selectedPreviews.pic ? (
                                                    <img src={selectedPreviews.pic} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" onClick={() => previewFile(selectedSeller.seller_id, 'pic')} alt="Foto Diri" />
                                                ) : <span className="text-xs text-gray-400 italic">Tidak ada gambar</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 shrink-0">
                            <button onClick={closeDetails} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Reject Modal */}
            {rejecting.open && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full text-red-600">
                                <X className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Tolak Pendaftaran</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Mohon berikan alasan penolakan yang jelas agar penjual dapat memperbaiki data pendaftaran mereka.
                        </p>
                        
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                            rows={4}
                            placeholder="Tulis alasan penolakan di sini..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setRejecting({ open: false, sellerId: null })}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={doReject}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                            >
                                Kirim Penolakan
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
