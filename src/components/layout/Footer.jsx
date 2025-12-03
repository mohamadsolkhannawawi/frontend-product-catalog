import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer
            style={{ background: "#2b2c40" }}
            className="text-gray-100 mt-16"
        >
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Column 1: Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-2xl font-extrabold">
                                Catalozy
                            </div>
                        </div>
                        <div className="text-sm text-gray-200 font-semibold mb-2">
                            Katalog Produk Andalan GenZ
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Catalozy adalah Katalog Edukatif untuk produk lokal
                            katalog terkurasi yang menonjolkan transparansi
                            harga, ketersediaan stok, lokasi penjual, dan ulasan
                            jujur. Kami mendukung UMKM untuk tampil lebih
                            profesional dan membantu pembeli membuat keputusan
                            yang lebih cerdas.
                        </p>
                        <p className="text-xs text-gray-400 mt-3">
                            Penjual diverifikasi manual untuk menjaga
                            kepercayaan.
                        </p>
                    </div>

                    {/* Column 2: Explore */}
                    <div>
                        <h4 className="font-semibold text-gray-100 mb-4">
                            Jelajahi
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link
                                    to="/catalog"
                                    className="hover:text-purple-300"
                                >
                                    Katalog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/catalog?category=fashion"
                                    className="hover:text-purple-300"
                                >
                                    Fashion
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/catalog?category=electronics"
                                    className="hover:text-purple-300"
                                >
                                    Elektronik
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/catalog?sort=top"
                                    className="hover:text-purple-300"
                                >
                                    Produk Terlaris
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/search"
                                    className="hover:text-purple-300"
                                >
                                    Cari Produk
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Sellers */}
                    <div>
                        <h4 className="font-semibold text-gray-100 mb-4">
                            Bergabung Bersama Kami
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link
                                    to="/register"
                                    className="hover:text-purple-300"
                                >
                                    Daftar sebagai Penjual
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/guide"
                                    className="hover:text-purple-300"
                                >
                                    Panduan Penjual
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="hover:text-purple-300"
                                >
                                    Masuk Penjual
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div>
                        <h4 className="font-semibold text-gray-100 mb-4">
                            Bantuan
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link
                                    to="/help"
                                    className="hover:text-purple-300"
                                >
                                    Pusat Bantuan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="hover:text-purple-300"
                                >
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="hover:text-purple-300"
                                >
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-purple-300"
                                >
                                    Hubungi Kami
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-400">
                            © {year} Catalozy, All Rights Reserved.
                        </div>
                        <div className="text-sm text-gray-400">
                            Dibuat dengan bangga oleh Tim Catalozy
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://instagram.com"
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-purple-300"
                            >
                                <Instagram size={20} aria-hidden />
                            </a>
                            <a
                                href="mailto:hello@catalozy.id"
                                aria-label="Email"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-purple-300"
                            >
                                <Mail size={20} aria-hidden />
                            </a>
                            <a
                                href="https://twitter.com"
                                aria-label="X"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-purple-300"
                            >
                                <Twitter size={20} aria-hidden />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
