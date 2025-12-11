import React from "react";
import { X } from "lucide-react";

/**
 * Base Modal Component
 * Center overlay modal with dimmed background
 */
export const Modal = ({ isOpen, onClose, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`bg-white rounded-lg shadow-2xl p-6 w-full mx-4 ${sizeClasses[size]}`}
            >
                {children}
            </div>
        </div>
    );
};

/**
 * Confirmation Modal Component
 */
export const ConfirmationModal = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    isDangerous = false,
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${
                            isDangerous
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-purple-500 hover:bg-purple-600"
                        }`}
                    >
                        {isLoading ? "Memproses..." : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

/**
 * Rejection Modal with Textarea Input
 */
export const RejectionModal = ({
    isOpen,
    onClose,
    title,
    message,
    onSubmit,
    isLoading = false,
}) => {
    const [reason, setReason] = React.useState("");

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
            setReason("");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-gray-600">{message}</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contoh: Foto KTP buram..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={4}
                />
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !reason.trim()}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                    >
                        {isLoading ? "Mengirim..." : "Kirim Penolakan"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

/**
 * Success Modal with Icon
 */
export const SuccessModal = ({
    isOpen,
    onClose,
    title,
    message,
    actionText = "Lanjutkan",
    onAction,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-gray-600">{message}</p>
                <div className="pt-2">
                    <button
                        onClick={onAction || onClose}
                        className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

/**
 * Applicant Detail Modal
 */
export const ApplicantDetailModal = ({
    isOpen,
    onClose,
    applicant,
    onApprove,
    onReject,
    isLoading = false,
}) => {
    const handleReject = () => {
        onReject(applicant.id);
    };

    const handleApprove = () => {
        onApprove(applicant.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Data Pendaftar
                </h2>

                {/* Applicant Info */}
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Nama Penjual</p>
                        <p className="text-gray-900 font-medium">
                            {applicant?.sellerName || "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Nama Toko</p>
                        <p className="text-gray-900 font-medium">
                            {applicant?.storeName || "-"}
                        </p>
                    </div>
                </div>

                {/* Document Images */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Dokumen</p>
                    <div className="grid grid-cols-2 gap-4">
                        {/* KTP Image */}
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            {applicant?.ktpImage ? (
                                <img
                                    src={applicant.ktpImage}
                                    alt="KTP"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Photo Image */}
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            {applicant?.photoImage ? (
                                <img
                                    src={applicant.photoImage}
                                    alt="Photo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={handleReject}
                        disabled={isLoading}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
                    >
                        Tolak
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Memproses..." : "Setuju"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
