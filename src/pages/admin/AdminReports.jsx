import React, { useState } from "react";
import api from "@/lib/axios";
import { Download, FileText, Loader } from "lucide-react";

export default function AdminReports() {
    const [loading, setLoading] = useState({
        sellers: false,
        province: false,
        products: false,
    });

    const downloadReport = async (reportType) => {
        try {
            setLoading((prev) => ({ ...prev, [reportType]: true }));

            let endpoint = "";
            let filename = "";

            switch (reportType) {
                case "sellers":
                    endpoint = "/dashboard/admin/reports/sellers";
                    filename = "seller-accounts-report.pdf";
                    break;
                case "province":
                    endpoint = "/dashboard/admin/reports/sellers-by-province";
                    filename = "sellers-by-province-report.pdf";
                    break;
                case "products":
                    endpoint = "/dashboard/admin/reports/top-rated-products";
                    filename = "top-rated-products-report.pdf";
                    break;
                default:
                    return;
            }

            const response = await api.get(endpoint, {
                params: { format: "pdf" },
                responseType: "blob",
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            // Log detailed server error when available to help debugging
            if (error?.response) {
                try {
                    // If server returned JSON error, attempt to read it
                    const reader = new FileReader();
                    const blob = error.response.data;
                    if (blob && blob instanceof Blob) {
                        reader.onload = () => {
                            console.error(
                                "Download error (response):",
                                reader.result
                            );
                        };
                        reader.readAsText(blob);
                    } else {
                        console.error(
                            "Download error (response):",
                            error.response.data
                        );
                    }
                } catch (e) {
                    console.error("Download error while reading response:", e);
                }
            } else {
                console.error("Download error:", error);
            }
        } finally {
            setLoading((prev) => ({ ...prev, [reportType]: false }));
        }
    };

    const reportCards = [
        {
            key: "sellers",
            title: "Seller Accounts Report",
            description:
                "Complete list of all sellers (active & inactive) with contact details",
            icon: <FileText className="w-8 h-8" />,
            color: "bg-blue-50 border-blue-200",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
        },
        {
            key: "province",
            title: "Sellers by Province Report",
            description:
                "Distribution of sellers across provinces with detailed breakdown",
            icon: <FileText className="w-8 h-8" />,
            color: "bg-green-50 border-green-200",
            buttonColor: "bg-green-600 hover:bg-green-700",
        },
        {
            key: "products",
            title: "Top Rated Products Report",
            description:
                "Complete list of highest rated products with store and province info",
            icon: <FileText className="w-8 h-8" />,
            color: "bg-purple-50 border-purple-200",
            buttonColor: "bg-purple-600 hover:bg-purple-700",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold mb-2">Admin Reports</h1>
                <p className="text-gray-600">
                    Download PDF reports for platform analysis and management
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportCards.map((card) => (
                    <div
                        key={card.key}
                        className={`${card.color} border rounded-lg p-6 flex flex-col`}
                    >
                        <div className="mb-4 text-gray-700">{card.icon}</div>
                        <h3 className="text-lg font-semibold mb-2">
                            {card.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6 flex-grow">
                            {card.description}
                        </p>
                        <button
                            onClick={() => downloadReport(card.key)}
                            disabled={loading[card.key]}
                            className={`${card.buttonColor} text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading[card.key] ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Report Description */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Report Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h4 className="font-medium mb-2">Seller Accounts</h4>
                        <p className="text-gray-600">
                            Lists all sellers with their store names, emails,
                            provinces, and activation status. Includes active
                            and inactive sellers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">
                            Sellers by Province
                        </h4>
                        <p className="text-gray-600">
                            Shows distribution of sellers across different
                            provinces with detailed breakdown including store
                            counts and contact information.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Top Rated Products</h4>
                        <p className="text-gray-600">
                            Displays the highest-rated products with
                            corresponding store names, categories, prices, and
                            customer provinces.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
