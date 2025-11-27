import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 z-10">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
