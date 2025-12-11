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

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch categories
    api
      .get(API_ENDPOINTS.CATEGORIES)
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
      const p = res.data.data || res.data || res; // Handle structure variation

      setName(p.name || p.title || "");
      setDescription(p.description || "");
      setPrice(p.price || 0);
      setStock(p.stock || 0);
      setCategoryId(p.category_id || "");
      // Note: Handling existing images usually requires passing them to ImageUploader
      // or managing separate state, but keeping simple as per your snippet.
    } catch (e) {
      toast.error("Gagal memuat produk");
      navigate("/seller/products");
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

    // Append new images
    if (images && images.length > 0) {
      images.forEach((f) => form.append("images[]", f));
    }

    try {
      setLoading(true);

      if (id) {
        // FIX: Method Spoofing untuk Laravel (Wajib saat upload file di method PUT/PATCH)
        form.append("_method", "PUT");

        // Tetap gunakan api.post, backend akan membacanya sebagai PUT karena ada _method
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
      console.error(e);
      // Optional: Show error message from backend
      const msg = e.response?.data?.message || "Failed to save product";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      {loading && <div className="mb-4 text-purple-600">Loading...</div>}

      <form
        onSubmit={submit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-200 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-200 outline-none"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              required
              type="number"
              min="0"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-200 outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              required
              type="number"
              min="0"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-200 outline-none"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            required
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-200 outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <ImageUploader onChange={(files) => setImages(files)} />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/seller/products")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
