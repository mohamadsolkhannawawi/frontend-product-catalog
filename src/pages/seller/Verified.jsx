import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SellerVerified() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sellerId = searchParams.get("seller");

    useEffect(() => {
        // Optional: fetch seller data or do something with sellerId
        // For now just display success message
    }, [sellerId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <CheckCircle
                        className="w-16 h-16 text-green-500"
                        strokeWidth={1.5}
                    />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Selamat!
                </h1>

                {/* Message */}
                <p className="text-gray-600 text-lg mb-2">
                    Verifikasi seller Anda berhasil
                </p>

                {/* Details */}
                <p className="text-gray-500 text-sm mb-8">
                    Akun Anda telah diverifikasi dan siap untuk mulai berjualan.
                    Silakan login untuk mengakses dashboard seller.
                </p>

                {/* Seller ID Display */}
                {sellerId && (
                    <div className="bg-gray-100 rounded p-3 mb-8">
                        <p className="text-xs text-gray-600 mb-1">ID Seller</p>
                        <p className="text-sm font-mono text-gray-700 break-all">
                            {sellerId}
                        </p>
                    </div>
                )}

                {/* CTA Button */}
                <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                    Ke Halaman Login
                </button>

                {/* Secondary Action */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );
}
