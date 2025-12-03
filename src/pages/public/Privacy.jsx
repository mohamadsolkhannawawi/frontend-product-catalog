import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7FB]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Kebijakan Privasi
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Informasi mengenai bagaimana Catalozy mengumpulkan dan
                        menggunakan data Anda.
                    </p>
                </header>

                <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-gray-700">
                    <h2 className="font-semibold mb-2">Pengumpulan Data</h2>
                    <p className="leading-relaxed">
                        Kami mengumpulkan data yang diperlukan untuk menjalankan
                        layanan, seperti informasi akun, transaksi, dan data
                        penjualan.
                    </p>

                    <h2 className="font-semibold mt-6 mb-2">Penggunaan Data</h2>
                    <p className="leading-relaxed">
                        Data digunakan untuk memproses pesanan, menyediakan
                        layanan, serta perbaikan layanan dan analitik.
                    </p>

                    <h2 className="font-semibold mt-6 mb-2">Keamanan</h2>
                    <p className="leading-relaxed">
                        Kami menjaga keamanan data sesuai praktik terbaik
                        industri.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
