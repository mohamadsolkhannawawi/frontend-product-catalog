import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";

export default function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(API_ENDPOINTS.SELLER_PRODUCTS);
            setProducts(res.data || res);
        } catch (e) {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const remove = async (id) => {
        if (!confirm("Hapus produk ini secara permanen?")) return;
        try {
            await api.delete(API_ENDPOINTS.SELLER_PRODUCT(id));
            toast.success("Produk dihapus");
            load();
        } catch (e) {}
    };

    const toggleActive = async (id, active) => {
        try {
            const endpoint = active
                ? API_ENDPOINTS.SELLER_PRODUCT_DEACTIVATE(id)
                : API_ENDPOINTS.SELLER_PRODUCT_ACTIVATE(id);
            await api.post(endpoint);
            toast.success(
                active ? "Produk dinonaktifkan" : "Produk diaktifkan"
            );
            load();
        } catch (e) {}
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Products</h2>
                <div className="flex gap-2">
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/seller/products/new")}
                    >
                        Add Product
                    </button>
                    <button className="btn-secondary" onClick={load}>
                        Refresh
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && products.length === 0 && <p>No products found.</p>}

            {!loading && products.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                    No
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                    Price
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                    Stock
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                    Status
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, idx) => (
                                <tr
                                    key={p.product_id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2 text-sm">
                                        {idx + 1}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {p.name || p.title || p.slug}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        Rp
                                        {Number(p.price).toLocaleString(
                                            "id-ID"
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {p.stock ?? "-"}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                p.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {p.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                onClick={() =>
                                                    navigate(
                                                        `/seller/products/${p.product_id}/edit`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`px-3 py-1 rounded text-xs font-medium ${
                                                    p.is_active
                                                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                }`}
                                                onClick={() =>
                                                    toggleActive(
                                                        p.product_id,
                                                        p.is_active
                                                    )
                                                }
                                            >
                                                {p.is_active
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                                                onClick={() =>
                                                    remove(p.product_id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
