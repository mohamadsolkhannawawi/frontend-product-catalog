import React, { useState } from "react";
import api from "@/lib/axios";
import {
    Download,
    Loader as LucideLoader,
    User,
    Map,
    Trophy,
} from "lucide-react";
import { BarsSpinner } from "@/components/common/Loader";
import toast from "react-hot-toast";

export default function AdminReports() {
    const [loading, setLoading] = useState({
        sellers: false,
        province: false,
        products: false,
    });

    const downloadReport = async (reportType) => {
        try {
            setLoading((prev) => ({ ...prev, [reportType]: true }));

            let endpoint = "";
            let filename = "";

            switch (reportType) {
                case "sellers":
                    endpoint = "/dashboard/admin/reports/sellers";
                    filename = "Laporan_Akun_Penjual.pdf";
                    break;
                case "province":
                    endpoint = "/dashboard/admin/reports/sellers-by-province";
                    filename = "Laporan_Sebaran_Penjual.pdf";
                    break;
                case "products":
                    endpoint = "/dashboard/admin/reports/top-rated-products";
                    filename = "Laporan_Produk_Terbaik.pdf";
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
            key: "sellers",
            title: "Laporan Akun Penjual",
            description: "Daftar lengkap semua penjual (aktif & tidak aktif).",
            icon: <User className="w-6 h-6 text-blue-600" />,
            iconBg: "bg-blue-100",
        },
        {
            key: "province",
            title: "Laporan Sebaran Penjual",
            description: "Distribusi penjual berdasarkan lokasi provinsi.",
            icon: <Map className="w-6 h-6 text-green-600" />,
            iconBg: "bg-green-100",
        },
        {
            key: "products",
            title: "Laporan Produk Terbaik",
            description: "Daftar produk dengan rating tertinggi di platform.",
            icon: <Trophy className="w-6 h-6 text-purple-600" />,
            iconBg: "bg-purple-100",
        },
    ];

    return (
        <div className="space-y-8 pb-10 text-left">
            {/* Header Page */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Laporan Admin
                </h1>
                <p className="text-gray-500 mt-1">
                    Unduh laporan analisis platform dan manajemen dalam format
                    PDF.
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
                            <div
                                className={`p-3 rounded-full ${item.iconBg} flex items-center justify-center`}
                            >
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                {item.title}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-8 flex-grow">
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
                                    <LucideLoader className="w-4 h-4 animate-spin text-white mr-2" />
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
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Informasi Isi Laporan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">
                            Akun Penjual
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Mencakup semua data kredensial penjual dan status
                            aktivasi terkini untuk keperluan audit user.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">
                            Sebaran Provinsi
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Analisis persebaran toko untuk pemetaan area layanan
                            dan identifikasi wilayah potensial.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">
                            Produk Terbaik
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Highlight produk unggulan berdasarkan ulasan murni
                            pengguna untuk strategi promosi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
