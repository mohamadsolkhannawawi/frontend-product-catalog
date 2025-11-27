import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";

export default function AdminSellers() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedPreviews, setSelectedPreviews] = useState({
        ktp: null,
        pic: null,
    });
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [rejecting, setRejecting] = useState({ open: false, sellerId: null });
    const [reason, setReason] = useState("");

    const loadPending = async () => {
        setLoading(true);
        try {
            const res = await api.get(API_ENDPOINTS.ADMIN_SELLERS + "/pending");
            setSellers(res.data || res);
        } catch (e) {
            // error handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, []);

    const approve = async (id) => {
        try {
            await api.post(API_ENDPOINTS.ADMIN_APPROVE_SELLER(id));
            toast.success("Seller approved");
            loadPending();
        } catch (e) {}
    };

    const openReject = (id) => {
        setRejecting({ open: true, sellerId: id });
        setReason("");
    };

    const previewFile = async (sellerId, type = "ktp") => {
        try {
            const endpoint =
                type === "ktp"
                    ? API_ENDPOINTS.ADMIN_SELLER_KTP(sellerId)
                    : API_ENDPOINTS.ADMIN_SELLER_PIC(sellerId);
            const res = await api.get(endpoint, { responseType: "blob" });
            try {
                if (
                    imagePreview &&
                    imagePreview.startsWith &&
                    imagePreview.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(imagePreview);
                }
            } catch (e) {}
            const url = URL.createObjectURL(res.data);
            setImagePreview(url);
        } catch (e) {
            toast.error("Gagal memuat gambar");
        }
    };

    const fetchBlobUrl = async (sellerId, type = "ktp") => {
        const endpoint =
            type === "ktp"
                ? API_ENDPOINTS.ADMIN_SELLER_KTP(sellerId)
                : API_ENDPOINTS.ADMIN_SELLER_PIC(sellerId);
        const res = await api.get(endpoint, { responseType: "blob" });
        return URL.createObjectURL(res.data);
    };

    const openDetails = async (sellerId) => {
        setDetailsLoading(true);
        try {
            const res = await api.get(
                `${API_ENDPOINTS.ADMIN_SELLERS}/${sellerId}`
            );
            const seller = res.data || res;
            setSelectedSeller(seller);

            // revoke any previous selected previews
            try {
                if (
                    selectedPreviews.ktp &&
                    selectedPreviews.ktp.startsWith &&
                    selectedPreviews.ktp.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(selectedPreviews.ktp);
                }
                if (
                    selectedPreviews.pic &&
                    selectedPreviews.pic.startsWith &&
                    selectedPreviews.pic.startsWith("blob:")
                ) {
                    URL.revokeObjectURL(selectedPreviews.pic);
                }
            } catch (e) {}

            const ktpUrl = seller.ktp_file_path
                ? await fetchBlobUrl(seller.seller_id, "ktp")
                : null;
            const picUrl = seller.pic_file_path
                ? await fetchBlobUrl(seller.seller_id, "pic")
                : null;
            setSelectedPreviews({ ktp: ktpUrl, pic: picUrl });
        } catch (e) {
            toast.error("Gagal memuat data pendaftar");
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeDetails = () => {
        try {
            if (
                selectedPreviews.ktp &&
                selectedPreviews.ktp.startsWith &&
                selectedPreviews.ktp.startsWith("blob:")
            ) {
                URL.revokeObjectURL(selectedPreviews.ktp);
            }
            if (
                selectedPreviews.pic &&
                selectedPreviews.pic.startsWith &&
                selectedPreviews.pic.startsWith("blob:")
            ) {
                URL.revokeObjectURL(selectedPreviews.pic);
            }
        } catch (e) {}
        setSelectedPreviews({ ktp: null, pic: null });
        setSelectedSeller(null);
    };

    const doReject = async () => {
        try {
            await api.post(
                `${API_ENDPOINTS.ADMIN_REJECT_SELLER(rejecting.sellerId)}`,
                { reason }
            );
            toast.success("Seller rejected");
            setRejecting({ open: false, sellerId: null });
            loadPending();
        } catch (e) {}
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Sellers</h2>
            {loading && <p>Loading...</p>}
            {!loading && sellers.length === 0 && <p>No pending sellers.</p>}

            {!loading && sellers.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Store</th>
                                <th className="px-4 py-2">PIC</th>
                                <th className="px-4 py-2">KTP</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((s) => (
                                <tr key={s.seller_id} className="border-t">
                                    <td className="px-4 py-2">{s.seller_id}</td>
                                    <td className="px-4 py-2">
                                        {s.store_name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {s.user?.name || s.user?.email}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2 items-center">
                                            {s.ktp_file_path ? (
                                                <button
                                                    className="text-blue-600"
                                                    onClick={() =>
                                                        previewFile(
                                                            s.seller_id,
                                                            "ktp"
                                                        )
                                                    }
                                                >
                                                    View ID Card
                                                </button>
                                            ) : (
                                                <span className="text-gray-500">
                                                    -
                                                </span>
                                            )}
                                            {s.pic_file_path ? (
                                                <button
                                                    className="text-blue-600"
                                                    onClick={() =>
                                                        previewFile(
                                                            s.seller_id,
                                                            "pic"
                                                        )
                                                    }
                                                >
                                                    View PIC
                                                </button>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                className="btn-secondary"
                                                onClick={() =>
                                                    openDetails(s.seller_id)
                                                }
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    approve(s.seller_id)
                                                }
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                onClick={() =>
                                                    openReject(s.seller_id)
                                                }
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {imagePreview && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                    onClick={() => {
                        try {
                            if (
                                imagePreview &&
                                imagePreview.startsWith &&
                                imagePreview.startsWith("blob:")
                            ) {
                                URL.revokeObjectURL(imagePreview);
                            }
                        } catch (e) {}
                        setImagePreview(null);
                    }}
                >
                    <img
                        src={imagePreview}
                        alt="preview"
                        className="max-w-full max-h-full p-4 bg-white rounded"
                    />
                </div>
            )}

            {selectedSeller && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded max-w-3xl w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">
                                Seller Details
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    className="btn-secondary"
                                    onClick={closeDetails}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        {detailsLoading ? (
                            <p className="mt-4">Loading...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p>
                                        <strong>ID:</strong>{" "}
                                        {selectedSeller.seller_id}
                                    </p>
                                    <p>
                                        <strong>Store:</strong>{" "}
                                        {selectedSeller.store_name}
                                    </p>
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {selectedSeller.store_description}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {selectedSeller.phone}
                                    </p>
                                    <p>
                                        <strong>Address:</strong>{" "}
                                        {selectedSeller.address}{" "}
                                        {selectedSeller.rt
                                            ? `RT ${selectedSeller.rt}`
                                            : ""}{" "}
                                        {selectedSeller.rw
                                            ? `/ RW ${selectedSeller.rw}`
                                            : ""}
                                    </p>
                                    <p>
                                        <strong>Province:</strong>{" "}
                                        {selectedSeller.province?.name ||
                                            selectedSeller.province_id}
                                    </p>
                                    <p>
                                        <strong>City:</strong>{" "}
                                        {selectedSeller.city?.name ||
                                            selectedSeller.city_id}
                                    </p>
                                    <p>
                                        <strong>District:</strong>{" "}
                                        {selectedSeller.district?.name ||
                                            selectedSeller.district_id}
                                    </p>
                                    <p>
                                        <strong>Village:</strong>{" "}
                                        {selectedSeller.village?.name ||
                                            selectedSeller.village_id}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {selectedSeller.status}
                                    </p>
                                    {selectedSeller.rejection_reason && (
                                        <p>
                                            <strong>Rejection Reason:</strong>{" "}
                                            {selectedSeller.rejection_reason}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p>
                                        <strong>User:</strong>{" "}
                                        {selectedSeller.user?.name} (
                                        {selectedSeller.user?.email})
                                    </p>
                                    <p>
                                        <strong>KTP Number:</strong>{" "}
                                        {selectedSeller.ktp_number}
                                    </p>
                                    <div className="flex gap-4 mt-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                PIC
                                            </p>
                                            {selectedPreviews.pic ? (
                                                <img
                                                    src={selectedPreviews.pic}
                                                    alt="pic"
                                                    className="max-h-48 rounded border"
                                                />
                                            ) : (
                                                <div className="text-gray-500">
                                                    No PIC
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                KTP
                                            </p>
                                            {selectedPreviews.ktp ? (
                                                <img
                                                    src={selectedPreviews.ktp}
                                                    alt="ktp"
                                                    className="max-h-48 rounded border"
                                                />
                                            ) : (
                                                <div className="text-gray-500">
                                                    No KTP
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {rejecting.open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-4 rounded w-96">
                        <h3 className="font-semibold mb-2">Reject Seller</h3>
                        <textarea
                            className="w-full border p-2"
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                className="btn-secondary"
                                onClick={() =>
                                    setRejecting({
                                        open: false,
                                        sellerId: null,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={doReject}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
