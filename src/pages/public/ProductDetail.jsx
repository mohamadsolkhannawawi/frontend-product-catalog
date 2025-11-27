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

const SELLER_WHATSAPP = "082327328582"; // Fallback number

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewRefresh, setReviewRefresh] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(API_ENDPOINTS.PRODUCT_DETAIL(slug));
                if (mounted) setProduct(res.data);
            } catch (e) {
                // handle later
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => (mounted = false);
    }, [slug]);

    if (loading) return <Loader />;

    if (!product)
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
                    <div className="text-center text-brand-gray-500">
                        Produk tidak ditemukan
                    </div>
                </main>
                <Footer />
            </div>
        );

    // Get images array - handle both array and fallback to primary_image
    const images =
        product.images && product.images.length > 0
            ? product.images
            : product.primary_image
            ? [product.primary_image]
            : [];

    const currentImage =
        images.length > 0
            ? images[currentImageIndex]
            : "https://via.placeholder.com/500x500?text=No+Image";

    const goToPrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleWhatsAppClick = () => {
        // Use seller phone if available, fallback to default
        const sellerPhone = product.seller?.phone || SELLER_WHATSAPP;
        const message = `Halo, saya tertarik dengan produk: ${product.name} (Rp${product.price})`;
        const url = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(
            message
        )}`;
        window.open(url, "_blank");
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                {/* Product Details Section */}
                <div className="bg-white rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Image Slider */}
                        <div className="flex flex-col">
                            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                                <img
                                    src={currentImage}
                                    alt={`${product.name} - ${
                                        currentImageIndex + 1
                                    }`}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/500x500?text=Gambar+Error";
                                    }}
                                />

                                {/* Navigation Arrows - Only show if multiple images */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={goToPrevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition z-10"
                                            aria-label="Gambar sebelumnya"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                                        </button>
                                        <button
                                            onClick={goToNextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition z-10"
                                            aria-label="Gambar berikutnya"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-800" />
                                        </button>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                                            {currentImageIndex + 1} /{" "}
                                            {images.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Preview - Only show if multiple images */}
                            {images.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentImageIndex(idx)
                                            }
                                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                                                idx === currentImageIndex
                                                    ? "border-brand-primary"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/64x64?text=X";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product Details */}
                        <div className="flex flex-col">
                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>

                            {/* Rating & Stock Status */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                <RatingStarDisplay
                                    rating={product.average_rating || 0}
                                />
                                <span
                                    className={`font-semibold ${
                                        product.stock > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {product.stock > 0
                                        ? `Stok: ${product.stock}`
                                        : "Habis"}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-sm text-gray-600">
                                    Harga
                                </span>
                                <div className="text-4xl font-bold text-brand-primary mt-1">
                                    {formatCurrency(product.price)}
                                </div>
                            </div>

                            {/* Category */}
                            {product.category && (
                                <div className="mb-4">
                                    <span className="text-sm text-gray-600">
                                        Kategori
                                    </span>
                                    <div className="font-medium text-gray-900 mt-1">
                                        {typeof product.category === "object"
                                            ? product.category.name
                                            : product.category}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6">
                                    <span className="text-sm text-gray-600">
                                        Deskripsi
                                    </span>
                                    <div className="text-gray-700 mt-2 leading-relaxed">
                                        {product.description}
                                    </div>
                                </div>
                            )}

                            {/* Location Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            Kota/Kabupaten
                                        </span>
                                        <div className="font-medium text-gray-900 mt-1">
                                            {product.seller?.city ||
                                                "Tidak ada data"}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            Provinsi
                                        </span>
                                        <div className="font-medium text-gray-900 mt-1">
                                            {product.seller?.province ||
                                                "Tidak ada data"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-sm text-gray-600">
                                    Penjual
                                </div>
                                <div className="font-bold text-gray-900 mt-1">
                                    {product.seller?.store_name ||
                                        "Toko Terpercaya"}
                                </div>
                                {product.seller?.store_description && (
                                    <div className="text-sm text-gray-600 mt-2">
                                        {product.seller.store_description}
                                    </div>
                                )}
                            </div>

                            {/* WhatsApp Button */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg mb-3"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Hubungi Penjual via WhatsApp
                            </button>

                            {product.stock === 0 && (
                                <div className="w-full bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-lg text-center">
                                    Produk Tidak Tersedia
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Ulasan Pembeli</h2>
                    <ReviewList
                        slug={product.slug}
                        refreshSignal={reviewRefresh}
                    />
                    <div className="mt-8 pt-8 border-t">
                        <h3 className="text-lg font-bold mb-4">
                            Berikan Ulasan Anda
                        </h3>
                        <ReviewForm
                            productId={product.product_id}
                            onSuccess={() => {
                                setReviewRefresh((s) => s + 1);
                            }}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
