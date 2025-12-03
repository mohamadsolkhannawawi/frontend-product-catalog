/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            // Udemy Design Tokens - Color Palette
            colors: {
                brand: {
                    purple: "#A435F0", // Udemy Primary
                    black: "#2D2F31", // Primary Text & Buttons
                    white: "#FFFFFF",
                    gray: {
                        50: "#F7F9FA", // Section Background
                        200: "#D1D7DC", // Borders
                        500: "#6A6F73", // Secondary Text
                        800: "#1C1D1F", // Darker Text
                    },
                },
                status: {
                    success: "#198754", // Active/Approved
                    danger: "#DC3545", // Rejected/Low Stock
                    warning: "#FFC107", // Pending
                    rating: "#E59819", // Star Rating
                },
            },
            // Typography
            fontFamily: {
                sans: ['"Inter"', '"Plus Jakarta Sans"', "sans-serif"],
            },
            // Shadows (Udemy-style)
            boxShadow: {
                card: "0 2px 4px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.08)",
                floating: "0 4px 8px rgba(0,0,0,.1), 0 8px 24px rgba(0,0,0,.1)",
            },
            // Border Radius
            borderRadius: {
                udemy: "4px", // Slightly sharp, not pill-shaped
            },
        },
    },
    plugins: [],
};
