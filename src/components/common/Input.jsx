import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ className = "", type = "text", ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    return (
        <div className="relative">
            <input 
                type={inputType} 
                className={`input-field ${className}`} 
                {...props} 
            />
            {isPasswordField && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            )}
        </div>
    );
}
