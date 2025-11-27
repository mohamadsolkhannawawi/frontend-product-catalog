import React from "react";

export default function Card({ children, className = "", ...props }) {
    return (
        <div
            className={`bg-white rounded-md shadow-sm p-4 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
