import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function ReviewList({ slug, refreshSignal }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(`/products/${slug}/reviews`);
                if (mounted) setReviews(res.data || res);
            } catch (e) {
                // ignore
            }
        })();

        return () => (mounted = false);
    }, [slug, refreshSignal]);

    if (!reviews || reviews.length === 0)
        return (
            <div className="text-sm text-gray-500 mt-3">Belum ada ulasan.</div>
        );

    return (
        <div className="space-y-4 mt-3">
            {reviews.map((r) => (
                <div
                    key={r.review_id || r.id}
                    className="p-3 bg-white rounded-md shadow-card"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm">
                            {r.name
                                ? r.name
                                      .split(" ")
                                      .map((s) => s[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()
                                : "U"}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">
                                        {r.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {r.phone && <span>{r.phone} • </span>}
                                        {r.province?.name}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= r.rating
                                                    ? "fill-yellow-400 stroke-yellow-500"
                                                    : "fill-gray-200 stroke-gray-300"
                                            }`}
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-gray-700 mt-2">
                                {r.comment}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
