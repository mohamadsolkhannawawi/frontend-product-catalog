import React from "react";

const VARIANTS = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
};

export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}) {
    const cls = `${VARIANTS[variant] || VARIANTS.primary} ${className}`;
    return (
        <button className={cls} {...props}>
            {children}
        </button>
    );
}
