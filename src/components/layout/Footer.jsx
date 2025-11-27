import React from "react";

export default function Footer() {
    return (
        <footer className="bg-brand-black text-white mt-12">
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 className="font-bold">About</h4>
                    <p className="text-sm text-gray-300 mt-2">
                        Educational e-commerce catalog inspired by Udemy
                        aesthetics.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold">Help</h4>
                    <ul className="mt-2 text-sm text-gray-300 space-y-1">
                        <li>Support</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold">Categories</h4>
                    <ul className="mt-2 text-sm text-gray-300 space-y-1">
                        <li>Electronics</li>
                        <li>Books</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 py-3 text-center text-sm">
                © {new Date().getFullYear()} Catalog Platform
            </div>
        </footer>
    );
}
