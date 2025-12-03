import React, { useEffect, useState } from "react";
import useRegion from "@/hooks/useRegion";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";

export default function ProductFilter({ initial = {}, onApply, onReset }) {
    const {
        provinces,
        cities,
        districts,
        villages,
        loadCities,
        loadDistricts,
        loadVillages,
    } = useRegion();
    const [filters, setFilters] = useState({
        province: "",
        city: "",
        district: "",
        village: "",
        min_price: "",
        max_price: "",
        category: "",
        sort: "newest",
        ...initial,
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(API_ENDPOINTS.CATEGORIES);
                const payload = res.data || res;
                const list = payload?.data || payload;
                if (mounted) setCategories(Array.isArray(list) ? list : []);
            } catch {
                if (mounted) setCategories([]);
                toast.error("Gagal memuat daftar kategori");
            }
        })();
        return () => (mounted = false);
    }, []);

    useEffect(() => {
        if (filters.province) loadCities(filters.province);
    }, [filters.province, loadCities]);

    useEffect(() => {
        if (filters.city) loadDistricts(filters.city);
    }, [filters.city, loadDistricts]);

    useEffect(() => {
        if (filters.district) loadVillages(filters.district);
    }, [filters.district, loadVillages]);

    const change = (k, v) => setFilters((s) => ({ ...s, [k]: v }));

    const apply = (e) => {
        e?.preventDefault();
        onApply && onApply(filters);
    };

    const reset = () => {
        const base = {
            province: "",
            city: "",
            district: "",
            village: "",
            min_price: "",
            max_price: "",
            category: "",
            sort: "newest",
        };
        setFilters(base);
        onReset && onReset();
    };

    return (
        <form
            onSubmit={apply}
            className="space-y-3 p-4 bg-white rounded-md shadow-card"
        >
            <h4 className="font-semibold">Filter</h4>

            <div>
                <label className="text-sm">Provinsi</label>
                <select
                    className="input-field mt-1"
                    value={filters.province}
                    onChange={(e) => change("province", e.target.value)}
                >
                    <option value="">Semua Provinsi</option>
                    {provinces.map((p) => (
                        <option key={p.code || p.id} value={p.code || p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm">Kota/Kabupaten</label>
                <select
                    className="input-field mt-1"
                    value={filters.city}
                    onChange={(e) => change("city", e.target.value)}
                >
                    <option value="">Semua Kota</option>
                    {cities.map((c) => (
                        <option key={c.code || c.id} value={c.code || c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm">Kecamatan</label>
                <select
                    className="input-field mt-1"
                    value={filters.district}
                    onChange={(e) => change("district", e.target.value)}
                >
                    <option value="">Semua Kecamatan</option>
                    {districts.map((d) => (
                        <option key={d.code || d.id} value={d.code || d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm">Desa/Kelurahan</label>
                <select
                    className="input-field mt-1"
                    value={filters.village}
                    onChange={(e) => change("village", e.target.value)}
                >
                    <option value="">Semua Kelurahan</option>
                    {villages.map((v) => (
                        <option key={v.code || v.id} value={v.code || v.id}>
                            {v.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm">Kategori</label>
                <select
                    className="input-field mt-1"
                    value={filters.category}
                    onChange={(e) => change("category", e.target.value)}
                >
                    <option value="">Semua Kategori</option>
                    {(Array.isArray(categories) ? categories : []).map((c) => (
                        <option key={c.category_id} value={c.category_id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm">Harga Minimal</label>
                <input
                    type="number"
                    className="input-field mt-1"
                    placeholder="Contoh: 50000"
                    value={filters.min_price}
                    onChange={(e) => change("min_price", e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm">Harga Maksimal</label>
                <input
                    type="number"
                    className="input-field mt-1"
                    placeholder="Contoh: 500000"
                    value={filters.max_price}
                    onChange={(e) => change("max_price", e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm">Urutkan</label>
                <select
                    className="input-field mt-1"
                    value={filters.sort}
                    onChange={(e) => change("sort", e.target.value)}
                >
                    <option value="newest">Terbaru</option>
                    <option value="price_asc">Harga: Terendah</option>
                    <option value="price_desc">Harga: Tertinggi</option>
                    <option value="rating_desc">Rating: Tertinggi</option>
                </select>
            </div>

            <div className="mt-4 flex justify-between gap-2">
            <button
                type="submit"
                className="btn-primary w-full"
            >
                Terapkan
            </button>

            <button
                type="button"
                onClick={reset}
                className="btn-secondary w-full"
            >
                Reset
            </button>
        </div>

        </form>
    );
}
