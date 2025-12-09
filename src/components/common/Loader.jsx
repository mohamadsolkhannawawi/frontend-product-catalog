import React from "react";
import { Bars } from "react-loader-spinner";

export function SkeletonCard() {
    return (
        <div className="card">
            <div
                className="skeleton"
                style={{ height: 140, borderRadius: 8 }}
            />
            <div className="mt-3">
                <div
                    className="skeleton"
                    style={{ height: 16, width: "60%", borderRadius: 4 }}
                />
                <div
                    className="mt-2 skeleton"
                    style={{ height: 12, width: "40%", borderRadius: 4 }}
                />
            </div>
        </div>
    );
}

export function SkeletonChip() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center py-4 px-2 h-28 w-full">
            <div
                className="skeleton"
                style={{ height: 44, width: 44, borderRadius: 9999 }}
            />
            <div style={{ height: 8 }} />
            <div
                className="skeleton"
                style={{ height: 12, width: "70%", borderRadius: 6 }}
            />
        </div>
    );
}

export default function Loader({
    variant = "spinner",
    count = 4,
    className = "",
}) {
    // variant: 'spinner' | 'skeleton' | 'chip'
    if (variant === "skeleton") {
        const items = Array.from({ length: count });
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (variant === "chip") {
        // Render a single centered Bars spinner without any surrounding box
        // Use a full-screen fixed overlay so it's centered top/bottom/left/right and inherit brand color
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center text-brand-purple ${className}`}
            >
                <Bars
                    height={48}
                    width={48}
                    color={"currentColor"}
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        );
    }

    // default: full-screen spinner centered, inherits brand color
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center text-brand-purple ${className}`}
        >
            <Bars
                height={80}
                width={80}
                color={"currentColor"}
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
}

// Export a configurable Bars spinner for inline/button use
export function BarsSpinner({ size = 24, className = "" }) {
    return (
        <div
            className={`inline-flex items-center justify-center text-brand-purple ${className}`}
        >
            <Bars
                height={String(size)}
                width={String(size)}
                color={"currentColor"}
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
}
