import React from "react";

export default function OnboardingStepper({ step = 1, steps = [] }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            {steps.map((s, idx) => (
                <div key={s} className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            idx + 1 === step
                                ? "bg-brand-purple text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {idx + 1}
                    </div>
                    <div className="text-sm text-gray-700">{s}</div>
                    {idx < steps.length - 1 && (
                        <div className="w-8 h-0.5 bg-gray-200" />
                    )}
                </div>
            ))}
        </div>
    );
}
