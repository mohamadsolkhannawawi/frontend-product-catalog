import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package,
    RotateCcw,
} from "lucide-react";
import { BarsSpinner } from "@/components/common/Loader";
import toast from "react-hot-toast";

export default function SellerProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/dashboard/seller/products");
            const data = res.data.data || res.data || [];
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
            toast.error("Gagal memuat produk");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
        setDeletingId(id);
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((p) => p.product_id !== id));
            toast.success("Produk berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus produk");
        } finally {
            setDeletingId(null);
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header Section (Title Only) */}
            <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-800">
                    Kelola Produk
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Daftar produk yang Anda jual di platform.
                </p>
            </div>

            {/* Toolbar: Search (Left) & Buttons (Right) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search Filter */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-fit">
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on search
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={fetchProducts}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm font-medium text-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => navigate("/seller/products/new")}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center items-center text-gray-500">
                        <BarsSpinner size={20} className="mr-2" /> Memuat
                        produk...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Package className="w-8 h-8" />
                        </div>
                        <p className="text-base font-medium text-gray-900">
                            Belum ada produk
                        </p>
                        <p className="text-sm mt-1">
                            Mulai dengan menambahkan produk baru Anda.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="p-4 w-16">No</th>
                                    <th className="p-4">Info Produk</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Harga</th>
                                    <th className="p-4">Stok</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedProducts.map((product, index) => (
                                    <tr
                                        key={product.product_id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* No */}
                                        <td className="p-4 align-middle text-sm text-gray-600 font-medium">
                                            {(currentPage - 1) * itemsPerPage +
                                                index +
                                                1}
                                        </td>

                                        {/* Info Produk */}
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                                    {product.images &&
                                                    product.images[0] ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                                    .image_url
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Package className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm line-clamp-1">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px] mt-0.5">
                                                        {product.description ||
                                                            "Tidak ada deskripsi"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kategori */}
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                {product.category?.name ||
                                                    "Uncategorized"}
                                            </span>
                                        </td>

                                        {/* Harga */}
                                        <td className="p-4 align-middle text-sm font-semibold text-gray-900">
                                            {formatPrice(product.price)}
                                        </td>

                                        {/* Stok */}
                                        <td className="p-4 align-middle">
                                            <span
                                                className={`text-sm font-medium ${
                                                    product.stock < 5
                                                        ? "text-red-600"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {product.stock} Unit
                                            </span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/seller/products/edit/${product.product_id}`
                                                        )
                                                    }
                                                    className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors border border-transparent hover:border-yellow-200"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.product_id
                                                        )
                                                    }
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-200"
                                                    title="Hapus"
                                                    disabled={
                                                        deletingId ===
                                                        product.product_id
                                                    }
                                                >
                                                    {deletingId ===
                                                    product.product_id ? (
                                                        <BarsSpinner
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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
                {filteredProducts.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <p className="text-xs text-gray-500">
                            Menampilkan{" "}
                            <span className="font-bold text-gray-700">
                                {(currentPage - 1) * itemsPerPage + 1}-
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    filteredProducts.length
                                )}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold text-gray-700">
                                {filteredProducts.length}
                            </span>{" "}
                            produk
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
