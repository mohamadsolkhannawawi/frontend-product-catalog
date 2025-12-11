import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import Loader from "@/components/common/Loader";
import ReviewList from "@/components/features/reviews/ReviewList";
import ReviewForm from "@/components/features/reviews/ReviewForm";
import RatingStarDisplay from "@/components/common/RatingStarDisplay";

const SELLER_WHATSAPP = "082327328582";

export default function ProductDetail() {
    const { slug } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviewRefresh, setReviewRefresh] = useState(0);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const res = await api.get(API_ENDPOINTS.PRODUCT_DETAIL(slug));
                if (mounted) setProduct(res.data);
            } catch (e) {
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => (mounted = false);
    }, [slug]);

    if (loading) return <Loader />;
    if (!product) return <NotFound />;

    const images =
        product.images?.length > 0
            ? product.images
            : product.primary_image
            ? [product.primary_image]
            : [];

    const currentImage =
        images[currentImageIndex] ||
        "https://via.placeholder.com/600x600?text=No+Image";

    const goPrev = () =>
        setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));

    const goNext = () =>
        setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    const formatCurrency = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const handleWhatsAppClick = () => {
        const phone = product.seller?.phone || SELLER_WHATSAPP;
        const msg = `Halo, saya tertarik dengan produk: ${product.name}`;
        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
            "_blank"
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7F8]">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
                {/* MAIN GRID – Follows entire page */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-10">
                    {/* LEFT SIDE – Scrolls normally */}
                    <div className="space-y-10">
                        {/* IMAGE PANEL */}
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <div className="relative aspect-square bg-gray-50 rounded-xl flex items-center justify-center">
                                <img
                                    src={currentImage}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={goPrev}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100"
                                        >
                                            <ChevronLeft />
                                        </button>

                                        <button
                                            onClick={goNext}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100"
                                        >
                                            <ChevronRight />
                                        </button>
                                    </>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentImageIndex(idx)
                                            }
                                            className={`h-20 w-28 rounded-xl overflow-hidden border-2 ${
                                                idx === currentImageIndex
                                                    ? "border-purple-500"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PRODUCT INFO PANEL (NAME + RATING + DESCRIPTION + LOCATION in one panel) */}
                        <div className="bg-white rounded-2xl text-left shadow-sm p-8 space-y-8">
                            {/* Name */}
                            <h1 className="text-4xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                <RatingStarDisplay
                                    rating={product.average_rating || 0}
                                />
                                <span className="text-gray-700 text-lg font-medium">
                                    {product.average_rating?.toFixed(1) ||
                                        "0.0"}
                                </span>
                            </div>

                            {/* Status Badge */}
                            {product.status && (
                                <div>
                                    <span
                                        className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                                            product.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : product.status === "draft"
                                                ? "bg-gray-100 text-gray-800"
                                                : product.status === "inactive"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : product.status ===
                                                  "discontinued"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {product.status === "active"
                                            ? "✓ Aktif"
                                            : product.status === "draft"
                                            ? "Draft"
                                            : product.status === "inactive"
                                            ? "Tidak Aktif"
                                            : product.status === "discontinued"
                                            ? "Dihentikan"
                                            : product.status}
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Deskripsi
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* LOCATION PANEL — nested */}
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Detail Lokasi
                                </h3>

                                <div className="space-y-4">
                                    {/* Kota/Kabupaten Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <span className="text-gray-600 font-medium">
                                            Kota/Kabupaten
                                        </span>
                                        <span className="text-gray-900 font-bold">
                                            {product.seller?.city?.toUpperCase() ||
                                                "-"}
                                        </span>
                                    </div>

                                    {/* Provinsi Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <span className="text-gray-600 font-medium">
                                            Provinsi
                                        </span>
                                        <span className="text-gray-900 font-bold">
                                            {product.seller?.province?.toUpperCase() ||
                                                "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* REVIEWS */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Ulasan Pembeli
                            </h2>

                            <ReviewList
                                slug={product.slug}
                                refreshSignal={reviewRefresh}
                            />

                            <div className="mt-10 border-t pt-8">
                                <h3 className="text-xl font-semibold mb-4">
                                    Berikan Ulasan Anda
                                </h3>
                                <ReviewForm
                                    productId={product.product_id}
                                    onSuccess={() =>
                                        setReviewRefresh((v) => v + 1)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE – Sticky Price Panel */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* PRICE */}
                            <div className="text-4xl font-bold text-gray-900">
                                {formatCurrency(product.price)}
                            </div>

                            {/* STOCK */}
                            <div className="mt-2 text-green-600 font-semibold">
                                Stok: {product.stock}
                            </div>

                            <div className="my-6 border-b"></div>

                            {/* SELLER INFO */}
                            <div className="text-sm font-semibold text-gray-600 mb-2">
                                Penjual
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                                    {product.seller?.store_name
                                        ?.substring(0, 2)
                                        .toUpperCase() || "TN"}
                                </div>

                                <div>
                                    <div className="font-bold text-gray-900">
                                        {product.seller?.store_name}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        {product.seller?.store_description}
                                    </div>
                                </div>
                            </div>

                            {/* WA BUTTON */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-4 rounded-xl flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Hubungi Penjual via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="py-20 text-center text-gray-500">
                Produk tidak ditemukan
            </main>
            <Footer />
        </div>
    );
}
