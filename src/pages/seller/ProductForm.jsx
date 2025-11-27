import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import ImageUploader from "@/components/features/seller/ImageUploader";
import toast from "react-hot-toast";

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch categories
        api.get(API_ENDPOINTS.CATEGORIES)
            .then((res) => {
                setCategories(res.data.data || []);
            })
            .catch((err) => {
                console.error("Failed to fetch categories", err);
            });
    }, []);

    const load = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await api.get(API_ENDPOINTS.SELLER_PRODUCT(id));
            const p = res.data || res;
            setName(p.name || p.title || "");
            setDescription(p.description || "");
            setPrice(p.price || 0);
            setStock(p.stock || 0);
            setCategoryId(p.category_id || "");
        } catch (e) {
            // handled
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("name", name);
        form.append("description", description);
        form.append("price", price);
        form.append("stock", stock);
        if (categoryId) {
            form.append("category_id", categoryId);
        }
        images.forEach((f) => form.append("images[]", f));

        try {
            setLoading(true);
            if (id) {
                await api.post(API_ENDPOINTS.SELLER_PRODUCT(id), form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Product updated");
            } else {
                await api.post(API_ENDPOINTS.SELLER_PRODUCTS, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Product created");
            }
            navigate("/seller/products");
        } catch (e) {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
                {id ? "Edit Product" : "Add Product"}
            </h2>
            {loading && <p>Loading...</p>}
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        className="w-full border p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        className="w-full border p-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Price
                        </label>
                        <input
                            type="number"
                            className="w-full border p-2"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Stock
                        </label>
                        <input
                            type="number"
                            className="w-full border p-2"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Category
                    </label>
                    <select
                        className="w-full border p-2"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option
                                key={cat.category_id}
                                value={cat.category_id}
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Images
                    </label>
                    <ImageUploader onChange={(files) => setImages(files)} />
                </div>

                <div className="flex gap-2">
                    <button className="btn-primary" type="submit">
                        Save
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/seller/products")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
