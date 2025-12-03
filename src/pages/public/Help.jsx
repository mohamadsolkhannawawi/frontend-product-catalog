import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Help() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7FB]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Pusat Bantuan
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Temukan jawaban atas pertanyaan umum dan panduan
                        penggunaan Catalozy.
                    </p>
                </header>

                <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-3">
                        Pertanyaan Umum
                    </h2>
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <h3 className="font-semibold">
                                Bagaimana cara membeli?
                            </h3>
                            <p className="mt-1">
                                Cari produk, pilih varian dan jumlah, lalu
                                lanjutkan ke checkout. Ikuti instruksi
                                pembayaran yang tersedia.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Bagaimana memverifikasi penjual?
                            </h3>
                            <p className="mt-1">
                                Penjual diverifikasi secara manual oleh tim
                                Catalozy. Pastikan data yang dikirim lengkap.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-6 mb-3">
                        Hubungi Kami
                    </h2>
                    <p className="text-gray-700">
                        Jika pertanyaan Anda belum terjawab, silakan gunakan
                        halaman Kontak untuk mengirim pesan kepada tim kami.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
