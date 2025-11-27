import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import RatingStarDisplay from "@/components/common/RatingStarDisplay";

export default function ProductCard({ product }) {
    // Primary image (atau first image jika tidak ada primary_image)
    let imageUrl = null;

    // Try primary_image first
    if (product.primary_image) {
        imageUrl = product.primary_image;
    }
    // Then try first image from array
    else if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {
        imageUrl = product.images[0];
    }

    // Fallback placeholder
    if (!imageUrl) {
        imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
    }

    const stock = product.stock || 0;
    const city = product.city || product.seller?.city || "—";

    return (
        <Link to={`/products/${product.slug}`} className="block">
            <div className="bg-white rounded-md shadow-card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Primary Image */}
                <div className="overflow-hidden bg-gray-100 relative">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
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
                <div className="p-3">
                    {/* Category Badge */}
                    {product.category && product.category.name && (
                        <div className="mb-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                {product.category.name}
                            </span>
                        </div>
                    )}

                    {/* Nama Produk */}
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    {/* Harga */}
                    <div className="text-lg font-bold text-brand-primary mb-2">
                        {formatCurrency(product.price)}
                    </div>

                    {/* Rating & Stock */}
                    <div className="flex items-center gap-2 mb-2">
                        <RatingStarDisplay rating={product.average_rating} />
                        <span className="text-xs text-gray-500">|</span>
                        <div className="text-xs font-medium text-gray-600">
                            {stock > 0 ? `${stock} stok` : "Habis"}
                        </div>
                    </div>

                    {/* Kota/Kabupaten */}
                    <div className="text-xs text-gray-500 truncate">
                        📍 {city}
                    </div>
                </div>
            </div>
        </Link>
    );
}
