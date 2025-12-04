import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/features/products/ProductGrid";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import Loader from "@/components/common/Loader";

import * as Icons from "lucide-react";

// category labels come directly from backend

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        const loadInitial = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get(API_ENDPOINTS.CATEGORIES),
                    api.get(API_ENDPOINTS.CATALOG),
                ]);

                const catPayload = catRes.data || catRes;
                const catList = catPayload?.data || catPayload || [];
                if (mounted)
                    setCategories(Array.isArray(catList) ? catList : []);

                if (mounted)
                    setProducts(prodRes.data.data || prodRes.data || []);
            } catch {
                // silent
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadInitial();

        return () => (mounted = false);
    }, []);

    const navigateToCatalogWithCategory = (slug) => {
        // Navigate to catalog page and include category_slug so Catalog can auto-scroll
        navigate(`/catalog?category_slug=${encodeURIComponent(slug)}`);
    };

    // categories now loaded from backend `GET /categories`

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7FB]">
            <Navbar />

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-6 flex-1">
                {/* HERO SECTION */}
                <section className="pt-16 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-5xl font-bold text-brand-black leading-tight">
                            Platform Katalog
                            <br />
                            Edukatif
                        </h1>

                        <p className="mt-6 text-lg text-brand-gray-600 leading-relaxed max-w-xl">
                            Desain profesional, cari produk terbaik dari toko
                            lokal Indonesia dengan mudah dan terpercaya.
                        </p>

                        <a
                            href="/catalog"
                            className="inline-block mt-8 bg-brand-purple text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition"
                        >
                            Jelajahi Produk
                        </a>
                    </div>

                    <div className="flex justify-center">
                        <img
                            src="/src/assets/images/broken-photo.png"
                            alt="Hero"
                            className="w-full max-w-xl rounded-lg"
                        />
                    </div>
                </section>

                {/* CATEGORY SECTION */}
                <section className="mt-10">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Kategori Produk
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
                        {(categories || [])
                            .filter((c) => !c.parent_id) // only top-level categories
                            .slice(0, 14)
                            .map((item) => {
                                const IconComp =
                                    item.icon && Icons[item.icon]
                                        ? Icons[item.icon]
                                        : Icons.Box;
                                return (
                                    <button
                                        key={item.category_id}
                                        onClick={() =>
                                            navigateToCatalogWithCategory(
                                                item.slug
                                            )
                                        }
                                        className={`bg-white rounded-lg py-4 px-2 shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition focus:outline-none`}
                                    >
                                        <IconComp
                                            size={28}
                                            className="text-brand-purple"
                                        />
                                        <p className="mt-2 text-brand-black font-medium text-sm text-center px-1 break-words">
                                            {item.name}
                                        </p>
                                    </button>
                                );
                            })}
                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section className="mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">Semua Produk</h2>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : (
                        <ProductGrid products={products} columns={4} />
                    )}
                </section>

                {/* (Statistics removed per request) */}
            </main>

            {/* (Seller promotion removed per request) */}

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
