import React, { useState } from "react";
import {
    ConfirmationModal,
    RejectionModal,
    SuccessModal,
    ApplicantDetailModal,
} from "../ui/Modal";
import { Alert, ToastContainer } from "../ui/Toast";

/**
 * Feedback System & Notification UI Kit
 * Displays all confirmation modals, success alerts, error messages, and detail views
 */
export const FeedbackUIKit = () => {
    // Modal states
    const [modals, setModals] = useState({
        logoutConfirm: false,
        deleteProductConfirm: false,
        deactivateSellerConfirm: false,
        rejectionModal: false,
        registrationSuccess: false,
        applicantDetail: false,
    });

    // Alert states
    const [alerts, setAlerts] = useState({
        generalSuccess: true,
        loginSuccess: true,
        reviewSubmitted: true,
        reportGenerated: true,
        sellerApproved: true,
        loginFailed: true,
        validationError: true,
        duplicatePhone: true,
        duplicateEmail: true,
        duplicateNIK: true,
        fileError: true,
    });

    const toggleModal = (key) => {
        setModals((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAlert = (key) => {
        setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Mock applicant data
    const mockApplicant = {
        id: 1,
        sellerName: "Budi Santoso",
        storeName: "Toko Elektronik Budi",
        ktpImage: "https://via.placeholder.com/300x200?text=KTP",
        photoImage: "https://via.placeholder.com/300x200?text=Foto+Diri",
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Feedback System & Notification UI Kit
                </h1>
                <p className="text-gray-600 mb-8">
                    Catalozy - Curated Local Marketplace Design System
                </p>

                {/* GROUP 1: CONFIRMATION MODALS */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Group 1: Confirmation Modals
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Logout Confirmation */}
                        <button
                            onClick={() => toggleModal("logoutConfirm")}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                        >
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Logout Confirmation
                            </h3>
                            <p className="text-sm text-gray-600">
                                Konfirmasi Logout
                            </p>
                        </button>

                        {/* Delete Product Confirmation */}
                        <button
                            onClick={() => toggleModal("deleteProductConfirm")}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                        >
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Delete Product
                            </h3>
                            <p className="text-sm text-gray-600">
                                Hapus Produk Confirmation
                            </p>
                        </button>

                        {/* Deactivate Seller Confirmation */}
                        <button
                            onClick={() =>
                                toggleModal("deactivateSellerConfirm")
                            }
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                        >
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Deactivate Seller
                            </h3>
                            <p className="text-sm text-gray-600">
                                Nonaktifkan Penjual
                            </p>
                        </button>

                        {/* Rejection Modal */}
                        <button
                            onClick={() => toggleModal("rejectionModal")}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                        >
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Reject Applicant
                            </h3>
                            <p className="text-sm text-gray-600">
                                Tolak Pendaftaran
                            </p>
                        </button>
                    </div>
                </section>

                {/* GROUP 2: SUCCESS NOTIFICATIONS */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Group 2: Success Alerts & Notifications
                    </h2>

                    <div className="space-y-4 bg-white p-6 rounded-lg">
                        {/* General Success */}
                        {alerts.generalSuccess && (
                            <Alert
                                type="success"
                                message="Berhasil! Data telah disimpan."
                                onClose={() => toggleAlert("generalSuccess")}
                            />
                        )}

                        {/* Login Success */}
                        {alerts.loginSuccess && (
                            <Alert
                                type="success"
                                message="Selamat Datang! Login berhasil."
                                onClose={() => toggleAlert("loginSuccess")}
                            />
                        )}

                        {/* Review Submitted */}
                        {alerts.reviewSubmitted && (
                            <Alert
                                type="success"
                                message="Terima Kasih! Ulasan Anda berhasil dikirim."
                                onClose={() => toggleAlert("reviewSubmitted")}
                            />
                        )}

                        {/* Report Generated */}
                        {alerts.reportGenerated && (
                            <Alert
                                type="success"
                                message="Laporan Siap! File PDF berhasil diunduh."
                                onClose={() => toggleAlert("reportGenerated")}
                            />
                        )}

                        {/* Seller Approved */}
                        {alerts.sellerApproved && (
                            <Alert
                                type="success"
                                message="Status Diperbarui. Penjual berhasil diaktifkan."
                                onClose={() => toggleAlert("sellerApproved")}
                            />
                        )}
                    </div>

                    {/* Registration Success Modal Button */}
                    <div className="mt-4">
                        <button
                            onClick={() => toggleModal("registrationSuccess")}
                            className="bg-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition-shadow font-medium text-gray-900"
                        >
                            Show Registration Success Modal
                        </button>
                    </div>
                </section>

                {/* GROUP 3: ERROR & VALIDATION ALERTS */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Group 3: Error & Validation Alerts
                    </h2>

                    <div className="space-y-4 bg-white p-6 rounded-lg">
                        {/* Login Failed */}
                        {alerts.loginFailed && (
                            <Alert
                                type="error"
                                title="Login Gagal"
                                message="Password atau Email salah."
                                onClose={() => toggleAlert("loginFailed")}
                            />
                        )}

                        {/* Validation Error */}
                        {alerts.validationError && (
                            <Alert
                                type="error"
                                title="Data Tidak Lengkap"
                                message="Harap isi semua field wajib (*)."
                                onClose={() => toggleAlert("validationError")}
                            />
                        )}

                        {/* Duplicate Phone */}
                        {alerts.duplicatePhone && (
                            <Alert
                                type="warning"
                                title="Data Duplikat"
                                message="Nomor HP sudah terdaftar."
                                onClose={() => toggleAlert("duplicatePhone")}
                            />
                        )}

                        {/* Duplicate Email */}
                        {alerts.duplicateEmail && (
                            <Alert
                                type="warning"
                                title="Data Duplikat"
                                message="Email sudah digunakan."
                                onClose={() => toggleAlert("duplicateEmail")}
                            />
                        )}

                        {/* Duplicate NIK */}
                        {alerts.duplicateNIK && (
                            <Alert
                                type="warning"
                                title="Data Duplikat"
                                message="NIK KTP sudah terdaftar."
                                onClose={() => toggleAlert("duplicateNIK")}
                            />
                        )}

                        {/* File Error */}
                        {alerts.fileError && (
                            <Alert
                                type="error"
                                title="Gagal Upload"
                                message="Ukuran file gambar terlalu besar (Maks 2MB)."
                                onClose={() => toggleAlert("fileError")}
                            />
                        )}
                    </div>
                </section>

                {/* GROUP 4: DETAIL VIEWS */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Group 4: Applicant Detail Modal
                    </h2>
                    <button
                        onClick={() => toggleModal("applicantDetail")}
                        className="bg-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition-shadow font-medium text-gray-900"
                    >
                        Show Applicant Detail
                    </button>
                </section>
            </div>

            {/* MODALS */}

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={modals.logoutConfirm}
                onClose={() => toggleModal("logoutConfirm")}
                title="Konfirmasi Logout"
                message="Anda akan keluar dari sesi ini."
                confirmText="Keluar"
                onConfirm={() => {
                    toggleModal("logoutConfirm");
                }}
            />

            {/* Delete Product Confirmation Modal */}
            <ConfirmationModal
                isOpen={modals.deleteProductConfirm}
                onClose={() => toggleModal("deleteProductConfirm")}
                title="Hapus Produk?"
                message="Produk yang dihapus tidak dapat dikembalikan."
                confirmText="Hapus"
                isDangerous={true}
                onConfirm={() => {
                    toggleModal("deleteProductConfirm");
                }}
            />

            {/* Deactivate Seller Confirmation Modal */}
            <ConfirmationModal
                isOpen={modals.deactivateSellerConfirm}
                onClose={() => toggleModal("deactivateSellerConfirm")}
                title="Nonaktifkan Penjual?"
                message="Toko ini tidak akan bisa diakses oleh pembeli."
                confirmText="Nonaktifkan"
                isDangerous={true}
                onConfirm={() => {
                    toggleModal("deactivateSellerConfirm");
                }}
            />

            {/* Rejection Modal with Input */}
            <RejectionModal
                isOpen={modals.rejectionModal}
                onClose={() => toggleModal("rejectionModal")}
                title="Tolak Pendaftaran"
                message="Berikan alasan penolakan untuk dikirim ke email pendaftar."
                onSubmit={(reason) => {
                    console.log("Rejection reason:", reason);
                    toggleModal("rejectionModal");
                }}
            />

            {/* Registration Success Modal */}
            <SuccessModal
                isOpen={modals.registrationSuccess}
                onClose={() => toggleModal("registrationSuccess")}
                title="Pendaftaran Berhasil!"
                message="Data Anda terkirim. Tunggu verifikasi Admin via email."
                actionText="Lanjutkan"
                onAction={() => {
                    toggleModal("registrationSuccess");
                }}
            />

            {/* Applicant Detail Modal */}
            <ApplicantDetailModal
                isOpen={modals.applicantDetail}
                onClose={() => toggleModal("applicantDetail")}
                applicant={mockApplicant}
                onApprove={(id) => {
                    console.log("Approved:", id);
                    toggleModal("applicantDetail");
                }}
                onReject={(id) => {
                    console.log("Rejected:", id);
                    toggleModal("applicantDetail");
                }}
            />
        </div>
    );
};

export default FeedbackUIKit;
