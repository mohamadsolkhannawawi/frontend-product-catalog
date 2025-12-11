import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/public/Home";
import Catalog from "@/pages/public/Catalog";
import ProductDetail from "@/pages/public/ProductDetail";
import RegisterSeller from "@/pages/seller/RegisterSeller";
import SellerVerified from "@/pages/seller/Verified";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import Guide from "@/pages/public/Guide";
import Help from "@/pages/public/Help";
import Terms from "@/pages/public/Terms";
import Privacy from "@/pages/public/Privacy";
import Contact from "@/pages/public/Contact";
import SellerDashboard from "@/pages/seller/Dashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SellerProducts from "@/pages/seller/SellerProducts";
import ProductForm from "@/pages/seller/ProductForm";
import ScrollToTop from "@/components/ScrollToTop";
import { FeedbackUIKit } from "@/components/ui/FeedbackUIKit";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/seller/register" element={<RegisterSeller />} />
                <Route path="/seller/verified" element={<SellerVerified />} />
                <Route
                    path="/seller/dashboard"
                    element={<SellerDashboard initialActive="overview" />}
                />
                <Route
                    path="/seller/products"
                    element={<SellerDashboard initialActive="products" />}
                />
                <Route
                    path="/seller/reports"
                    element={<SellerDashboard initialActive="reports" />}
                />
                <Route path="/seller/products/new" element={<ProductForm />} />
                <Route
                    path="/seller/products/:id/edit"
                    element={<ProductForm />}
                />

                {/* Admin Dashboard Routes */}
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard initialActive="overview" />}
                />
                <Route
                    path="/admin/dashboard/overview"
                    element={<AdminDashboard initialActive="overview" />}
                />
                <Route
                    path="/admin/dashboard/approval"
                    element={<AdminDashboard initialActive="approval" />}
                />
                <Route
                    path="/admin/dashboard/management"
                    element={<AdminDashboard initialActive="management" />}
                />
                <Route
                    path="/admin/dashboard/reports"
                    element={<AdminDashboard initialActive="reports" />}
                />

                {/* UI Kit Route (Development) */}
                <Route path="/ui-kit" element={<FeedbackUIKit />} />

                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}
