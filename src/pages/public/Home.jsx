import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/features/products/ProductGrid";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import Loader from "@/components/common/Loader";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(API_ENDPOINTS.CATALOG);
                if (mounted) setProducts(res.data.data || res.data);
            } catch (e) {
                // silent
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => (mounted = false);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black">
                            Platform Katalog Edukatif
                        </h1>
                        <p className="mt-3 text-brand-gray-500">
                            Desain profesional bergaya Udemy, cari produk
                            terbaik dari toko lokal.
                        </p>
                        <div className="mt-6">
                            <a href="/catalog" className="btn-primary">
                                Jelajahi Produk
                            </a>
                        </div>
                    </div>
                    <div>
                        <img
                            src="/src/assets/images/broken-photo.png"
                            alt="Hero"
                            className="w-full rounded-md shadow-floating"
                        />
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-lg font-semibold">Produk Unggulan</h2>
                    <div className="mt-4">
                        {loading ? (
                            <Loader />
                        ) : (
                            <ProductGrid products={products} />
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
