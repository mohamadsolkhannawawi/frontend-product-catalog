import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/features/products/ProductGrid";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import Loader from "@/components/common/Loader";

import {
    Laptop,
    Shirt,
    UtensilsCrossed,
    Home as HomeIcon,
    Heart,
    Gamepad2,
} from "lucide-react";

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

    const categories = [
        { icon: Laptop, label: "Elektronik" },
        { icon: Shirt, label: "Pakaian" },
        { icon: UtensilsCrossed, label: "Makanan" },
        { icon: HomeIcon, label: "Rumah Tangga" },
        { icon: Heart, label: "Kesehatan" },
        { icon: Gamepad2, label: "Hobi" },
    ];

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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {categories.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl py-8 shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition"
                            >
                                <item.icon
                                    size={40}
                                    className="text-brand-purple"
                                />
                                <p className="mt-3 text-brand-black font-medium text-base">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section className="mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">Produk Unggulan</h2>
                        <a
                            href="/catalog"
                            className="text-brand-purple font-medium hover:underline"
                        >
                            Lihat Semua
                        </a>
                    </div>

                    {loading ? <Loader /> : <ProductGrid products={products} />}
                </section>

                {/* STATISTICS SECTION */}
                <section className="mt-28 grid grid-cols-2 md:grid-cols-4 text-center py-12 bg-white rounded-2xl shadow-sm">
                    <div>
                        <h3 className="text-4xl font-bold text-brand-purple">
                            10,000+
                        </h3>
                        <p className="text-gray-600 mt-2">Produk Tersedia</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-brand-purple">
                            1,500+
                        </h3>
                        <p className="text-gray-600 mt-2">Toko Terdaftar</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-brand-purple">
                            25,000+
                        </h3>
                        <p className="text-gray-600 mt-2">Pengguna Aktif</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-bold text-brand-purple">
                            34
                        </h3>
                        <p className="text-gray-600 mt-2">Provinsi</p>
                    </div>
                </section>
            </main>

            {/* PURPLE PROMOTION SECTION */}
            <section className="mt-28 bg-brand-purple text-white py-20 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                    Bergabung Sebagai Penjual
                </h2>

                <p className="text-lg text-white opacity-95 mb-10">
                    Jual produk lokal Anda dan jangkau lebih banyak pembeli di
                    seluruh Indonesia
                </p>

                <div className="flex justify-center gap-6">
                    <a
                        href="/register-seller"
                        className="bg-white text-brand-purple font-medium px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition"
                    >
                        Daftar Sebagai Penjual
                    </a>

                    <a
                        href="/learn-more"
                        className="border border-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-purple transition"
                    >
                        Pelajari Lebih Lanjut
                    </a>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
