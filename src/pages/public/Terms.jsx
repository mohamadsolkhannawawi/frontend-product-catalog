import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Terms() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7FB]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Syarat &amp; Ketentuan
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Ketentuan penggunaan platform Catalozy. Bacalah dengan
                        seksama sebelum menggunakan layanan.
                    </p>
                </header>

                <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-gray-700">
                    <h2 className="font-semibold mb-2">1. Pengguna</h2>
                    <p className="leading-relaxed">
                        Pengguna setuju mematuhi aturan penggunaan dan tidak
                        melakukan tindakan merugikan pihak lain.
                    </p>

                    <h2 className="font-semibold mt-6 mb-2">2. Penjual</h2>
                    <p className="leading-relaxed">
                        Penjual bertanggung jawab atas keaslian produk dan
                        kebenaran informasi yang diunggah.
                    </p>

                    <h2 className="font-semibold mt-6 mb-2">3. Lain-lain</h2>
                    <p className="leading-relaxed">
                        Catalozy berhak mengubah ketentuan sewaktu-waktu dengan
                        pemberitahuan yang sesuai.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
