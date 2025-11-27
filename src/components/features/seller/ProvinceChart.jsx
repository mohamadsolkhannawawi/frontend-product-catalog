import React from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
} from "recharts";

const COLORS = [
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#6366F1",
    "#14B8A6",
    "#F97316",
    "#06B6D4",
];

export default function ProvinceChart({ data = [] }) {
    if (!data || data.length === 0)
        return (
            <div className="text-sm text-gray-500">
                Tidak ada data sebaran pemberi rating.
            </div>
        );

    // Sort by total descending and limit to 10
    const chartData = data
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
        .map((item) => ({
            name: item.province_name || "Tidak Diketahui",
            value: item.total,
        }));

    return (
        <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) =>
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} Review`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
