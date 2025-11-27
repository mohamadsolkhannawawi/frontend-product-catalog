import React from "react";

export default function Alert({ children, variant = "info", className = "" }) {
    const base = "w-full rounded-md p-3 flex items-start gap-3";
    const variants = {
        info: "bg-blue-50 text-blue-800",
        success: "bg-green-50 text-green-800",
        danger: "bg-red-50 text-red-800",
        warning: "bg-yellow-50 text-yellow-800",
    };

    return (
        <div
            className={`${base} ${
                variants[variant] || variants.info
            } ${className}`}
            role="status"
        >
            <div className="flex-1">{children}</div>
        </div>
    );
}
