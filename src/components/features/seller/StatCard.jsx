import React from "react";

export default function StatCard({ title, value, icon }) {
    return (
        <div className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-gray-50 flex items-center justify-center rounded">
                {icon}
            </div>
            <div>
                <div className="text-sm text-gray-500">{title}</div>
                <div className="text-xl font-bold">{value}</div>
            </div>
        </div>
    );
}
