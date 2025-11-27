import React from "react";

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

export default function Loader() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
}
