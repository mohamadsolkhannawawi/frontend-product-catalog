import React, { useState } from "react";
import { Download, Loader } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function SellerReports() {
    const [loading, setLoading] = useState(null);

    const downloadReport = async (reportType, reportName) => {
        setLoading(reportType);
        try {
            const response = await api.get(
                `/dashboard/seller/reports/${reportType}?format=pdf`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${reportName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`${reportName} berhasil diunduh`);
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengunduh laporan");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Laporan Penjual</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Report 1: Stock */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Laporan Stok Produk
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Daftar produk diurutkan dari stok terbanyak
                            </p>
                            <div className="bg-blue-50 p-3 rounded text-xs text-gray-700 space-y-1">
                                <p>
                                    <strong>Kolom:</strong>
                                </p>
                                <p>
                                    No, Nama Produk, Rating, Kategori, Harga,
                                    Stok
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                downloadReport("stock", "Laporan-Stok-Produk")
                            }
                            disabled={loading === "stock"}
                            className="w-full btn-primary inline-flex items-center justify-center gap-2"
                        >
                            {loading === "stock" ? (
                                <>
                                    <Loader
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download size={16} />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>

                    {/* Report 2: Rating */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Laporan Rating Produk
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Daftar produk diurutkan dari rating tertinggi
                            </p>
                            <div className="bg-blue-50 p-3 rounded text-xs text-gray-700 space-y-1">
                                <p>
                                    <strong>Kolom:</strong>
                                </p>
                                <p>
                                    No, Nama Produk, Stok, Kategori, Harga,
                                    Rating
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                downloadReport(
                                    "top-rated",
                                    "Laporan-Rating-Produk"
                                )
                            }
                            disabled={loading === "top-rated"}
                            className="w-full btn-primary inline-flex items-center justify-center gap-2"
                        >
                            {loading === "top-rated" ? (
                                <>
                                    <Loader
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download size={16} />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>

                    {/* Report 3: Restock */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Laporan Segera Dipesan
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Produk dengan stok menipis
                            </p>
                            <div className="bg-red-50 p-3 rounded text-xs text-gray-700 space-y-1">
                                <p>
                                    <strong>Kolom:</strong>
                                </p>
                                <p>No, Nama Produk, Kategori, Harga, Stok</p>
                                <p className="text-red-600 mt-1">
                                    Kondisi: Stok minimal 2
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                downloadReport(
                                    "restock",
                                    "Laporan-Segera-Dipesan"
                                )
                            }
                            disabled={loading === "restock"}
                            className="w-full btn-primary inline-flex items-center justify-center gap-2"
                        >
                            {loading === "restock" ? (
                                <>
                                    <Loader
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download size={16} />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        Info Laporan
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li>
                            - Laporan Stok: Semua produk diurutkan dari stok
                            terbanyak
                        </li>
                        <li>
                            - Laporan Rating: Semua produk diurutkan dari rating
                            tertinggi
                        </li>
                        <li>
                            - Laporan Segera Dipesan: Produk dengan stok menipis
                            untuk peringatan restock
                        </li>
                        <li>- Semua laporan dapat diunduh dalam format PDF</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
