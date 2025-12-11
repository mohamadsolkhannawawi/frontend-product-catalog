import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import RatingStarDisplay from "@/components/common/RatingStarDisplay";

export default function ProductCard({ product }) {
    // Primary image (atau first image jika tidak ada primary_image)
    let imageUrl = null;

    if (product.primary_image) {
        imageUrl = product.primary_image;
    } else if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {
        imageUrl = product.images[0];
    }

    if (!imageUrl) {
        imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
    }

    const stock = product.stock || 0;
    const city = product.city || product.seller?.city || "—";

    return (
        <Link to={`/products/${product.slug}`} className="block h-full">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
                {/* Primary Image */}
                <div className="overflow-hidden bg-gray-100 relative flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                    />
                    {stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded font-semibold">
                                Habis
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-grow flex flex-col">
                    {/* Nama Produk */}
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 h-10">
                        {product.name}
                    </h3>

                    {/* Category Badge */}
                    {product.category && product.category.name && (
                        <div className="mb-1">
                            <span className="inline-block bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full truncate max-w-full">
                                {product.category.name}
                            </span>
                        </div>
                    )}

                    {/* Status Badge */}
                    {product.status && (
                        <div className="mb-1">
                            <span
                                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    product.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : product.status === "draft"
                                        ? "bg-gray-100 text-gray-800"
                                        : product.status === "inactive"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : product.status === "discontinued"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {product.status === "active"
                                    ? "✓ Aktif"
                                    : product.status === "draft"
                                    ? "Draft"
                                    : product.status === "inactive"
                                    ? "Tidak Aktif"
                                    : product.status === "discontinued"
                                    ? "Dihentikan"
                                    : product.status}
                            </span>
                        </div>
                    )}

                    {/* STORE NAME */}
                    <p className="text-xs text-gray-500 mb-2 truncate">
                        {product.seller?.store_name}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                        <RatingStarDisplay rating={product.average_rating} />
                        <span className="text-xs text-gray-700 font-medium">
                            ({product.average_rating?.toFixed(1) || "0.0"})
                        </span>
                    </div>

                    {/* Harga */}
                    <div className="text-lg font-bold text-brand-purple mt-auto pt-2">
                        {formatCurrency(product.price)}
                    </div>

                    {/* Kota/Kabupaten */}
                    <div className="text-xs text-gray-500 mt-1 truncate">
                        Kab. {city}
                    </div>
                </div>
            </div>
        </Link>
    );
}
