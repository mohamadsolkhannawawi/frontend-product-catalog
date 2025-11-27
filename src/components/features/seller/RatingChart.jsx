import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function RatingChart({ data = [] }) {
    if (!data || data.length === 0)
        return (
            <div className="text-sm text-gray-500">Tidak ada data rating.</div>
        );

    // Transform data for chart
    const chartData = data.map((item) => ({
        name:
            item.name?.substring(0, 20) + (item.name?.length > 20 ? "..." : ""),
        rating: parseFloat(item.avg_rating || 0),
        reviews: item.total_reviews || 0,
    }));

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis
                        label={{
                            value: "Rating",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            if (name === "rating")
                                return [parseFloat(value).toFixed(2), "Rating"];
                            return [value, "Review"];
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="rating"
                        fill="#8B5CF6"
                        name="Rating Rata-rata"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
