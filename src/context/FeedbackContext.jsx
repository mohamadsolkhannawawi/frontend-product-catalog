import React, { createContext, useContext, useState } from "react";
import {
    ConfirmationModal,
    RejectionModal,
    SuccessModal,
} from "../components/ui/Modal";
import { ToastContainer, useToast } from "../components/ui/Toast";

/**
 * Feedback Context
 * Centralized management for modals, confirmations, and toasts
 */
const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
    const [modals, setModals] = useState({
        confirmation: { isOpen: false, config: {} },
        rejection: { isOpen: false, config: {} },
        success: { isOpen: false, config: {} },
    });

    const toastHook = useToast();

    // Confirmation Modal
    const showConfirmation = (config) => {
        setModals((prev) => ({
            ...prev,
            confirmation: {
                isOpen: true,
                config: {
                    title: "Konfirmasi",
                    message: "Apakah Anda yakin?",
                    confirmText: "Konfirmasi",
                    cancelText: "Batal",
                    isDangerous: false,
                    ...config,
                },
            },
        }));
    };

    const closeConfirmation = () => {
        setModals((prev) => ({
            ...prev,
            confirmation: { isOpen: false, config: {} },
        }));
    };

    // Rejection Modal
    const showRejection = (config) => {
        setModals((prev) => ({
            ...prev,
            rejection: {
                isOpen: true,
                config: {
                    title: "Tolak Pendaftaran",
                    message:
                        "Berikan alasan penolakan untuk dikirim ke email pendaftar.",
                    ...config,
                },
            },
        }));
    };

    const closeRejection = () => {
        setModals((prev) => ({
            ...prev,
            rejection: { isOpen: false, config: {} },
        }));
    };

    // Success Modal
    const showSuccess = (config) => {
        setModals((prev) => ({
            ...prev,
            success: {
                isOpen: true,
                config: {
                    title: "Berhasil!",
                    message: "Operasi berhasil dilakukan.",
                    actionText: "Lanjutkan",
                    ...config,
                },
            },
        }));
    };

    const closeSuccess = () => {
        setModals((prev) => ({
            ...prev,
            success: { isOpen: false, config: {} },
        }));
    };

    const value = {
        // Modals
        showConfirmation,
        closeConfirmation,
        showRejection,
        closeRejection,
        showSuccess,
        closeSuccess,
        // Toasts
        ...toastHook,
    };

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <ToastContainer
                toasts={toastHook.toasts}
                removeToast={toastHook.removeToast}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modals.confirmation.isOpen}
                onClose={closeConfirmation}
                {...modals.confirmation.config}
            />

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={modals.rejection.isOpen}
                onClose={closeRejection}
                {...modals.rejection.config}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={modals.success.isOpen}
                onClose={closeSuccess}
                {...modals.success.config}
                onAction={() => {
                    modals.success.config.onAction?.();
                    closeSuccess();
                }}
            />
        </FeedbackContext.Provider>
    );
};

/**
 * Hook to use Feedback context
 */
export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error("useFeedback must be used within FeedbackProvider");
    }
    return context;
};
