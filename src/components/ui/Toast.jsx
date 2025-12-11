import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Toast Container - Use at root level of your app
 */
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-40 space-y-3 pointer-events-none">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

/**
 * Single Toast Component
 */
const Toast = ({
    id,
    type = "info",
    message,
    duration = 5000,
    onClose,
    action,
}) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeConfig = {
        success: {
            bgColor: "bg-white",
            borderColor: "border-l-4 border-green-500",
            icon: CheckCircle,
            iconColor: "text-green-500",
            textColor: "text-gray-900",
        },
        error: {
            bgColor: "bg-white",
            borderColor: "border-l-4 border-red-500",
            icon: AlertCircle,
            iconColor: "text-red-500",
            textColor: "text-gray-900",
        },
        warning: {
            bgColor: "bg-white",
            borderColor: "border-l-4 border-yellow-500",
            icon: AlertTriangle,
            iconColor: "text-yellow-500",
            textColor: "text-gray-900",
        },
        info: {
            bgColor: "bg-white",
            borderColor: "border-l-4 border-blue-500",
            icon: Info,
            iconColor: "text-blue-500",
            textColor: "text-gray-900",
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <div
            className={`${config.bgColor} ${config.borderColor} rounded-lg shadow-lg p-4 flex items-center gap-3 pointer-events-auto max-w-sm animate-in slide-in-from-right-5 duration-300`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
            <p className={`flex-1 ${config.textColor} text-sm font-medium`}>
                {message}
            </p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

/**
 * Inline Alert Component
 * Use for form validation or page-level alerts
 */
export const Alert = ({ type = "info", title, message, onClose, action }) => {
    const typeConfig = {
        success: {
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            titleColor: "text-green-900",
            messageColor: "text-green-700",
            icon: CheckCircle,
            iconColor: "text-green-600",
        },
        error: {
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            titleColor: "text-red-900",
            messageColor: "text-red-700",
            icon: AlertCircle,
            iconColor: "text-red-600",
        },
        warning: {
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            titleColor: "text-yellow-900",
            messageColor: "text-yellow-700",
            icon: AlertTriangle,
            iconColor: "text-yellow-600",
        },
        info: {
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            titleColor: "text-blue-900",
            messageColor: "text-blue-700",
            icon: Info,
            iconColor: "text-blue-600",
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <div
            className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex gap-3`}
        >
            <Icon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`}
            />
            <div className="flex-1">
                {title && (
                    <h3 className={`font-semibold ${config.titleColor}`}>
                        {title}
                    </h3>
                )}
                <p
                    className={`${config.messageColor} text-sm ${
                        title ? "mt-1" : ""
                    }`}
                >
                    {message}
                </p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

/**
 * Toast Hook for easy integration
 */
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message, duration) =>
        addToast(message, "success", duration);
    const error = (message, duration) => addToast(message, "error", duration);
    const warning = (message, duration) =>
        addToast(message, "warning", duration);
    const info = (message, duration) => addToast(message, "info", duration);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};
