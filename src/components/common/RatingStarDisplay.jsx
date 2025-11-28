import React from "react";

export default function RatingStarDisplay({ rating = 0 }) {
    const displayRating = Math.round(rating * 10) / 10; // 1 decimal
    const maxStars = 5;

    return (
        <div className="flex items-center gap-1">
            {/* 5 Stars Render */}
            {Array.from({ length: maxStars }).map((_, index) => {
                const starNumber = index + 1;

                // Percentage fill untuk setiap star
                let fillPercentage = 0;

                if (displayRating >= starNumber) {
                    fillPercentage = 100; // full yellow
                } else if (displayRating + 1 > starNumber) {
                    fillPercentage = (displayRating - (starNumber - 1)) * 100; // partial fill
                }

                return (
                    <div key={index} className="relative w-5 h-5">
                        {/* BACKGROUND STAR (gray) */}
                        <svg
                            className="w-5 h-5 fill-gray-300 stroke-gray-400 absolute inset-0"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>

                        {/* YELLOW FILL (percentage controlled) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                        >
                            <svg
                                className="w-5 h-5 fill-yellow-400 stroke-yellow-500"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
