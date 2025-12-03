import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Guide() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7FB]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Panduan Menjadi Penjual di Catalozy
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Langkah demi langkah untuk mendaftar, memverifikasi
                        toko, dan mulai berjualan dengan standar katalog kami.
                    </p>
                </header>

                <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-3">1. Persiapan</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Siapkan foto produk berkualitas, informasi harga, stok,
                        serta identitas penjual (KTP/NPWP jika diperlukan) dan
                        alamat lengkap. Foto produk yang jelas membantu
                        meningkatkan kepercayaan pembeli.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">
                        2. Pendaftaran
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Daftar lewat tombol "Daftar sebagai Penjual" dan
                        lengkapi formulir pendaftaran dengan informasi yang
                        akurat.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">
                        3. Verifikasi
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Tim kami akan melakukan pemeriksaan manual untuk
                        memastikan data dan kualitas toko. Proses verifikasi
                        biasanya selesai dalam 1–3 hari kerja.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-3">
                        4. Tips Kurasi & Promosi
                    </h2>
                    <ul className="list-disc pl-5 text-gray-700">
                        <li>Gunakan foto produk yang tajam dan rapi.</li>
                        <li>
                            Tuliskan deskripsi singkat yang jelas dan jujur.
                        </li>
                        <li>Tetapkan kebijakan pengiriman dan pengembalian.</li>
                    </ul>
                </section>
            </main>

            <Footer />
        </div>
    );
}
