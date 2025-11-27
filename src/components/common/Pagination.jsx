import React from "react";

export default function Pagination({
    currentPage = 1,
    lastPage = 1,
    onChange,
}) {
    if (lastPage <= 1) return null;

    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(lastPage, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className="px-3 py-1 border rounded"
            >
                Prev
            </button>
            {start > 1 && <span className="px-2">...</span>}
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`px-3 py-1 border rounded ${
                        p === currentPage ? "bg-brand-purple text-white" : ""
                    }`}
                >
                    {p}
                </button>
            ))}
            {end < lastPage && <span className="px-2">...</span>}
            <button
                disabled={currentPage === lastPage}
                onClick={() => onChange(currentPage + 1)}
                className="px-3 py-1 border rounded"
            >
                Next
            </button>
        </div>
    );
}
