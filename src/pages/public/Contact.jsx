import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F7FB]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12 flex-1">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Hubungi Kami
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Kirim pertanyaan, laporan masalah, atau permintaan
                        kerjasama melalui formulir di bawah.
                    </p>
                </header>

                <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-gray-700">
                    <form className="space-y-4 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nama
                            </label>
                            <input
                                className="input-field mt-1 w-full"
                                placeholder="Nama lengkap"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                className="input-field mt-1 w-full"
                                placeholder="email@domain.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pesan
                            </label>
                            <textarea
                                className="input-field mt-1 w-full h-32"
                                placeholder="Tulis pesan Anda di sini..."
                            ></textarea>
                        </div>

                        <div>
                            <button type="button" className="btn-primary">
                                Kirim Pesan
                            </button>
                        </div>
                    </form>
                </section>
            </main>

            <Footer />
        </div>
    );
}
