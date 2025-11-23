export const API_ENDPOINTS = {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",

    // Products
    PRODUCTS: "/products",
    PRODUCT_DETAIL: (id) => `/products/${id}`,
    PRODUCT_SEARCH: "/products/search",

    // Categories
    CATEGORIES: "/categories",

    // Regions
    PROVINCES: "/regions/provinces",
    DISTRICTS: (provinceId) => `/regions/districts/${provinceId}`,
    SUBDISTRICTS: (districtId) => `/regions/subdistricts/${districtId}`,
    VILLAGES: (subdistrictId) => `/regions/villages/${subdistrictId}`,

    // Reviews
    REVIEWS: (productId) => `/products/${productId}/reviews`,
    SUBMIT_REVIEW: (productId) => `/products/${productId}/reviews`,

    // Seller
    SELLER_REGISTER: "/seller/register",
    SELLER_DASHBOARD: "/seller/dashboard",
    SELLER_PRODUCTS: "/seller/products",
    SELLER_STATS: "/seller/stats",
    SELLER_REPORTS: "/seller/reports",

    // Admin
    ADMIN_SELLERS: "/admin/sellers",
    ADMIN_APPROVE_SELLER: (id) => `/admin/sellers/${id}/approve`,
};

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Catalog Platform";
