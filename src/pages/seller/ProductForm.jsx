import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants"; // Mengembalikan import constants
import {
    ChevronLeft,
    Save,
    UploadCloud,
    X,
    Image as ImageIcon,
} from "lucide-react";
import Loader, { BarsSpinner } from "@/components/common/Loader";
import toast from "react-hot-toast";

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
    });

    // Image Handling
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await api.get(API_ENDPOINTS.CATEGORIES);
            setCategories(res.data.data || res.data || []);
        } catch (e) {
            console.error("Failed to fetch categories");
        }
    };

    const fetchProduct = async () => {
        setLoading(true);
        try {
            // Menggunakan endpoint asli
            const res = await api.get(API_ENDPOINTS.SELLER_PRODUCT(id));
            const product = res.data.data || res.data;

            setFormData({
                name: product.name || product.title || "",
                description: product.description || "",
                price: product.price || 0,
                stock: product.stock || 0,
                category_id: product.category_id || "",
            });
            setExistingImages(product.images || []);
        } catch (e) {
            toast.error("Gagal memuat produk");
            navigate("/seller/products");
        } finally {
            setLoading(false);
        }
    };

    // Helper untuk memproses file (baik dari input maupun drop)
    const processFiles = (files) => {
        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );

        if (validFiles.length > 0) {
            setNewImages((prev) => [...prev, ...validFiles]);
            const newPreviews = validFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        } else if (files.length > 0) {
            toast.error("Harap unggah file gambar saja (JPG/PNG)");
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            try {
                URL.revokeObjectURL(prev[index]);
            } catch (e) {}
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("stock", formData.stock);

            if (formData.category_id) {
                data.append("category_id", formData.category_id);
            }

            // Menggunakan key images[] sesuai kode asli
            newImages.forEach((file) => {
                data.append("images[]", file);
            });

            // Menggunakan endpoint API asli
            if (isEdit) {
                await api.post(API_ENDPOINTS.SELLER_PRODUCT(id), data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Produk berhasil diperbarui");
            } else {
                await api.post(API_ENDPOINTS.SELLER_PRODUCTS, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Produk berhasil ditambahkan");
            }
            navigate("/seller/products");
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data?.message || "Gagal menyimpan produk";
            toast.error(msg);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    toast.error(`${key}: ${errors[key][0]}`);
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <BarsSpinner size={80} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {submitting && <Loader />}
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => navigate("/seller/products")}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-200 transition-colors shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEdit
                            ? "Perbarui informasi produk Anda"
                            : "Isi informasi di bawah untuk menambahkan produk"}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
                <div className="p-8 space-y-8">
                    {/* Section: Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                            Informasi Dasar
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Nama Produk */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Nama Produk{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder-gray-400"
                                    placeholder="Contoh: Laptop Gaming ASUS ROG..."
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Kategori & Harga & Stok */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Kategori{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                                        value={formData.category_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category_id: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((c) => (
                                            <option
                                                key={c.category_id}
                                                value={c.category_id}
                                            >
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Harga (Rp){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Stok{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder-gray-400"
                                    rows="5"
                                    placeholder="Jelaskan spesifikasi, fitur, dan keunggulan produk Anda..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Images */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                            Galeri Produk
                        </h3>

                        {/* Upload Box - Clickable & Draggable */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-purple-300 transition-all cursor-pointer relative group"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center justify-center">
                                <div className="p-4 bg-purple-50 rounded-full text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    Klik atau seret foto ke sini
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Format: JPG, PNG, JPEG (Max 2MB)
                                </p>
                            </div>
                        </div>

                        {/* Image Preview Grid */}
                        {(imagePreviews.length > 0 ||
                            existingImages.length > 0) && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                                {/* Existing Images (Edit Mode) */}
                                {existingImages.map((img, idx) => (
                                    <div
                                        key={`exist-${idx}`}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                                    >
                                        <img
                                            src={img.image_url || img}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                                Tersimpan
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* New Images */}
                                {imagePreviews.map((url, idx) => (
                                    <div
                                        key={`new-${idx}`}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                                    >
                                        <img
                                            src={url}
                                            alt="New Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeNewImage(idx);
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/seller/products")}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <BarsSpinner size={16} className="mr-2" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Simpan Produk
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
