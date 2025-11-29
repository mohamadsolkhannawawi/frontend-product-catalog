export const API_ENDPOINTS = {
    // Auth - Updated endpoint paths
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    // backend: POST /validate/unique exists; frontend issues GET with query params for convenience
    CHECK_UNIQUE: (field, value) =>
        `/validate/unique?field=${field}&value=${encodeURIComponent(value)}`,
    // Seller onboarding
    SELLER_ONBOARD: "/seller/onboard",

    // Products
    // Public catalog (backend uses /catalog)
    CATALOG: "/catalog",
    PRODUCT_DETAIL: (slug) => `/catalog/${slug}`,
    PRODUCT_SEARCH: "/catalog/search",
    PRODUCT_FILTER: "/catalog/filter",

    // Categories
    CATEGORIES: "/categories",

    // Regions (match backend routes)

    PROVINCES: "/locations/provinces",
    CITIES: (provinceCode) => `/locations/provinces/${provinceCode}/cities`,
    DISTRICTS: (cityCode) => `/locations/cities/${cityCode}/districts`,
    VILLAGES: (districtCode) => `/locations/districts/${districtCode}/villages`,

    // Reviews
    REVIEWS_BY_PRODUCT_SLUG: (slug) => `/products/${slug}/reviews`,
    SUBMIT_REVIEW: "/reviews",
    SUBMIT_REVIEW_FOR_PRODUCT: (productId) =>
        `/catalog/products/${productId}/reviews`,

    // Seller (dashboard)
    SELLER_DASHBOARD_OVERVIEW: "/dashboard/seller/overview",
    SELLER_PRODUCTS: "/dashboard/seller/products",
    SELLER_PRODUCT: (id) => `/dashboard/seller/products/${id}`,
    SELLER_PRODUCT_ACTIVATE: (id) =>
        `/dashboard/seller/products/${id}/activate`,
    SELLER_PRODUCT_DEACTIVATE: (id) =>
        `/dashboard/seller/products/${id}/deactivate`,
    SELLER_REPORTS_STOCK: "/dashboard/seller/reports/stock",

    // Admin (dashboard)
    ADMIN_STATS: "/dashboard/admin/stats",
    ADMIN_SELLERS_PENDING: "/dashboard/admin/sellers/pending",
    ADMIN_SELLERS: "/dashboard/admin/sellers",
    ADMIN_SELLER: (id) => `/dashboard/admin/sellers/${id}`,
    ADMIN_APPROVE_SELLER: (id) => `/dashboard/admin/sellers/${id}/approve`,
    ADMIN_REJECT_SELLER: (id) => `/dashboard/admin/sellers/${id}/reject`,
    ADMIN_SELLER_ACTIVATE: (id) => `/dashboard/admin/sellers/${id}/activate`,
    ADMIN_SELLER_DEACTIVATE: (id) =>
        `/dashboard/admin/sellers/${id}/deactivate`,
    ADMIN_SELLER_KTP: (id) => `/dashboard/admin/sellers/${id}/ktp`,
    ADMIN_SELLER_PIC: (id) => `/dashboard/admin/sellers/${id}/pic`,
    ADMIN_CHARTS_PRODUCTS_BY_CATEGORY:
        "/dashboard/admin/charts/products-by-category",
    ADMIN_CHARTS_SELLERS_BY_PROVINCE:
        "/dashboard/admin/charts/sellers-by-province",
    ADMIN_CHARTS_SELLERS_STATUS: "/dashboard/admin/charts/sellers-status",
    ADMIN_CHARTS_TOTAL_REVIEWERS: "/dashboard/admin/charts/total-reviewers",
    ADMIN_REPORTS_SELLERS: "/dashboard/admin/reports/sellers",
    ADMIN_REPORTS_SELLERS_BY_PROVINCE:
        "/dashboard/admin/reports/sellers-by-province",
    ADMIN_REPORTS_TOP_RATED_PRODUCTS:
        "/dashboard/admin/reports/top-rated-products",
};

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Catalog Platform";
