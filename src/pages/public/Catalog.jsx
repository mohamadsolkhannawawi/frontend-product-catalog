import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/features/products/ProductGrid";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import Loader from "@/components/common/Loader";
import ProductFilter from "@/components/features/products/ProductFilter";
import Pagination from "@/components/common/Pagination";

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const q = searchParams.get("q") || "";

    const fetch = useCallback(async (params) => {
        setLoading(true);
        try {
            const res = await api.get(API_ENDPOINTS.PRODUCT_SEARCH, { params });
            const payload = res.data || {};
            const items = payload.data || payload;
            setProducts(items || []);
            setCurrentPage(payload.current_page || payload.currentPage || 1);
            setLastPage(payload.last_page || payload.lastPage || 1);
        } catch (e) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const params = {};
        for (const [k, v] of searchParams.entries()) {
            if (v !== "") params[k] = v;
        }
        params.page = parseInt(searchParams.get("page") || "1", 10);
        fetch(params);
    }, [searchParams, fetch]);

    function handleApply(filters) {
        const next = { ...Object.fromEntries(searchParams.entries()), page: 1 };
        if (filters.category) next.category_id = filters.category;
        if (filters.min_price) next.min_price = filters.min_price;
        if (filters.max_price) next.max_price = filters.max_price;
        if (filters.sort) next.sort = filters.sort;
        if (filters.province) next.province_id = filters.province;
        if (filters.city) next.city_id = filters.city;
        if (filters.district) next.district_id = filters.district;
        if (filters.village) next.village_id = filters.village;
        setSearchParams(next);
    }

    function handleReset() {
        setSearchParams({ q: searchParams.get("q") || "" });
    }

    function handlePage(p) {
        const next = Object.fromEntries(searchParams.entries());
        next.page = p;
        setSearchParams(next);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                <aside className="md:col-span-1">
                    <ProductFilter
                        initial={{}}
                        onApply={handleApply}
                        onReset={handleReset}
                    />
                </aside>

                <section className="md:col-span-3">
                    <header className="mb-4">
                        <h1 className="text-2xl font-bold">Hasil Pencarian</h1>
                        {q && (
                            <p className="text-sm text-brand-gray-500 mt-1">
                                Menampilkan hasil untuk "{q}"
                            </p>
                        )}
                    </header>

                    {loading ? <Loader /> : <ProductGrid products={products} />}

                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onChange={handlePage}
                    />
                </section>
            </main>
            <Footer />
        </div>
    );
}
