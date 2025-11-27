import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="text-center text-gray-500">Tidak ada produk</div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
                <ProductCard key={p.product_id || p.slug} product={p} />
            ))}
        </div>
    );
}
