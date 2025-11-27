import React from "react";

export default function RatingStarDisplay({ rating }) {
    // rating bisa berupa angka dengan decimal (misal 4.5)
    const displayRating = Math.round((rating || 0) * 10) / 10; // 1 decimal
    const percentage = ((displayRating || 0) / 5) * 100; // persentase fill

    return (
        <div className="flex items-center gap-1.5">
            <div className="relative w-4 h-4">
                {/* Background star (kosong) */}
                <svg
                    className="w-4 h-4 fill-gray-300 stroke-gray-400 absolute inset-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>

                {/* Foreground star (filled sesuai percentage) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${percentage}%` }}
                >
                    <svg
                        className="w-4 h-4 fill-yellow-400 stroke-yellow-500"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
            </div>

            {/* Rating text */}
            <span className="text-xs font-medium text-gray-700">
                {displayRating > 0 ? displayRating.toFixed(1) : "0"}
            </span>
        </div>
    );
}
