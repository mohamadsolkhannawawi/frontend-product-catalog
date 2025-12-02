import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const schema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
    rememberMe: z.boolean().optional(),
});

export default function Login() {
    const navigate = useNavigate();
    const auth = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { rememberMe: false },
    });

    async function onSubmit(values) {
        try {
            const response = await api.post("/login", {
                email: values.email,
                password: values.password,
            });

            // Save Bearer Token from response
            if (response.data.token) {
                localStorage.setItem("auth_token", response.data.token);
            }

            // Fetch current user (me) and update auth context
            let me = response.data.user || null;
            if (me) {
                auth.setAuthUser(me);
            }

            toast.success("Berhasil masuk");
            // Redirect based on role: admin -> admin dashboard, seller -> seller dashboard
            if (me && me.role === "admin") navigate("/admin/dashboard");
            else if (me && me.role === "seller") navigate("/seller/dashboard");
            else navigate("/");
        } catch (err) {
            // Show validation / server errors
            const msg = err?.response?.data?.message || "Login gagal";
            if (err?.response?.data?.errors) {
                const first = Object.values(err.response.data.errors)[0];
                toast.error(Array.isArray(first) ? first[0] : String(first));
            } else {
                toast.error(msg);
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Selamat Datang Kembali
                        </h1>
                        <p className="text-gray-600">
                            Masuk ke akun Catalozy Anda
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Email Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                </div>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder="email@contoh.com"
                                    className="h-12"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-purple-600 hover:underline transition"
                                    >
                                        Lupa password?
                                    </Link>
                                </div>
                                <Input
                                    {...register("password")}
                                    type="password"
                                    placeholder="Masukkan password Anda"
                                    className="h-12"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    {...register("rememberMe")}
                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-700 cursor-pointer select-none"
                                >
                                    Ingat saya
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-12 text-base font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Masuk..." : "Masuk"}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{" "}
                                <Link
                                    to="/register"
                                    className="text-purple-600 font-medium hover:underline transition"
                                >
                                    Daftar sebagai penjual
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
