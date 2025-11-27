import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function StockChart({ data = [] }) {
    if (!data || data.length === 0)
        return (
            <div className="text-sm text-gray-500">Tidak ada data stock.</div>
        );

    // Transform data for better display
    const chartData = data.map((item) => ({
        ...item,
        displayName:
            item.name?.substring(0, 20) + (item.name?.length > 20 ? "..." : ""),
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
                        dataKey="displayName"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis
                        label={{
                            value: "Stok",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                        }}
                        formatter={(value) => `${value} Unit`}
                        labelFormatter={(label) => `Produk: ${label}`}
                    />
                    <Bar
                        dataKey="stock"
                        fill="#A435F0"
                        name="Jumlah Stok"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
