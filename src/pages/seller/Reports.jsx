import React, { useState } from "react";
import api from "@/lib/axios";
import { Download, Loader, ShoppingBag, Package, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerReports() {
    const [loading, setLoading] = useState({
        sales: false,
        stock: false,
        reviews: false,
    });

    const downloadReport = async (reportType) => {
        try {
            setLoading((prev) => ({ ...prev, [reportType]: true }));

            let endpoint = "";
            let filename = "";

            switch (reportType) {
                case "sales":
                    endpoint = "/dashboard/seller/reports/sales";
                    filename = "Laporan_Penjualan.pdf";
                    break;
                case "stock":
                    endpoint = "/dashboard/seller/reports/stock";
                    filename = "Laporan_Stok_Produk.pdf";
                    break;
                case "reviews":
                    endpoint = "/dashboard/seller/reports/reviews";
                    filename = "Laporan_Ulasan_Produk.pdf";
                    break;
                default:
                    return;
            }

            const response = await api.get(endpoint, {
                params: { format: "pdf" },
                responseType: "blob",
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            toast.success("Laporan berhasil diunduh");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Gagal mengunduh laporan");
        } finally {
            setLoading((prev) => ({ ...prev, [reportType]: false }));
        }
    };

    const reports = [
        {
            key: "sales",
            title: "Laporan Penjualan",
            description: "Rekapitulasi transaksi penjualan yang berhasil, termasuk pendapatan dan status pesanan.",
            icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
            iconBg: "bg-blue-100",
        },
        {
            key: "stock",
            title: "Laporan Stok Produk",
            description: "Analisis ketersediaan stok produk saat ini untuk perencanaan restock barang.",
            icon: <Package className="w-6 h-6 text-green-600" />,
            iconBg: "bg-green-100",
        },
        {
            key: "reviews",
            title: "Laporan Ulasan & Rating",
            description: "Daftar ulasan pelanggan beserta rating untuk mengevaluasi kepuasan pembeli.",
            icon: <Star className="w-6 h-6 text-yellow-600" />,
            iconBg: "bg-yellow-100",
        },
    ];

    return (
        <div className="space-y-8 pb-10 text-left">
            {/* Header Page */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Laporan Toko</h1>
                <p className="text-gray-500 mt-1">
                    Unduh laporan kinerja toko dan penjualan Anda dalam format PDF.
                </p>
            </div>

            {/* Report Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.map((item) => (
                    <div
                        key={item.key}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow"
                    >
                        {/* Header Card */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-full ${item.iconBg} flex items-center justify-center`}>
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                {item.title}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-8 flex-grow leading-relaxed">
                            {item.description}
                        </p>

                        {/* Action Button (Purple) */}
                        <button
                            onClick={() => downloadReport(item.key)}
                            disabled={loading[item.key]}
                            className="w-full py-2.5 px-4 bg-purple-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-purple-700 transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-auto"
                        >
                            {loading[item.key] ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Information Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Isi Laporan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">Riwayat Penjualan</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Data lengkap mengenai transaksi yang telah selesai, dibatalkan, atau sedang diproses untuk pembukuan keuangan.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">Manajemen Stok</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Informasi detail mengenai jumlah stok fisik vs stok sistem untuk menghindari overselling.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">Kepuasan Pelanggan</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Ringkasan performa toko berdasarkan feedback pelanggan untuk meningkatkan kualitas layanan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}