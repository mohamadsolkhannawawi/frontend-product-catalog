import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

export default function Login() {
    const navigate = useNavigate();
    const auth = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

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
        <div className="min-h-screen flex flex-col">
            <main className="max-w-md mx-auto px-6 py-12 flex-1">
                <h1 className="text-2xl font-bold mb-4">Masuk</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <Input
                            {...register("email")}
                            placeholder="email@contoh.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <Input
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Masuk..." : "Masuk"}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-brand-gray-600 mt-4">
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-brand-primary">
                        Daftar
                    </Link>
                </p>
            </main>
        </div>
    );
}
