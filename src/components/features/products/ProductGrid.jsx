import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 4 }) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                Tidak ada produk
            </div>
        );
    }

    const gridClass =
        columns === 3
            ? "grid grid-cols-2 md:grid-cols-3 gap-6"
            : "grid grid-cols-2 md:grid-cols-4 gap-6";

    return (
        <div className={gridClass}>
            {products.map((p) => (
                <ProductCard
                    key={p.product_id || p.slug}
                    product={p}
                />
            ))}
        </div>
    );
}
