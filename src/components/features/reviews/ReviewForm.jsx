import React from "react";
import api from "@/lib/axios";
import useRegion from "@/hooks/useRegion";
import StarRating from "./StarRating";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "@/lib/constants";

const schema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(100),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(1, "Nomor telepon wajib diisi").max(32),
    province_id: z.string().min(1, "Provinsi wajib dipilih"),
    rating: z.number().min(1).max(5).default(5),
    comment: z.string().max(500).optional(),
});

export default function ReviewForm({ productId, onSuccess }) {
    const { provinces } = useRegion();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { rating: 5 },
    });

    const onSubmit = async (values) => {
        try {
            const payload = { ...values, product_id: productId };
            console.log("Submit review payload:", payload);
            await api.post(
                API_ENDPOINTS.SUBMIT_REVIEW_FOR_PRODUCT(productId),
                payload
            );
            toast.success("Ulasan berhasil dikirim — terima kasih!");
            reset();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Review submit error:", err);
            const msg = err.response?.data?.message || "Gagal mengirim ulasan";
            toast.error(msg);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 bg-white p-4 rounded-md shadow-card"
        >
            <h4 className="font-semibold">Tulis Ulasan</h4>

            {errors.root && (
                <div className="text-status-danger">{errors.root.message}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                    <input
                        {...register("name")}
                        placeholder="Nama"
                        className="input-field"
                    />
                    {errors.name && (
                        <p className="text-status-danger text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="input-field"
                    />
                    {errors.email && (
                        <p className="text-status-danger text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                    <input
                        {...register("phone")}
                        placeholder="Nomor Telepon"
                        type="tel"
                        className="input-field"
                    />
                    {errors.phone && (
                        <p className="text-status-danger text-sm mt-1">
                            {errors.phone.message}
                        </p>
                    )}
                </div>
                <div>
                    <select
                        {...register("province_id")}
                        className="input-field"
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((p) => (
                            <option key={p.code || p.id} value={p.code || p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    {errors.province_id && (
                        <p className="text-status-danger text-sm mt-1">
                            {errors.province_id.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating Produk
                </label>
                <StarRating control={control} name="rating" />
                {errors.rating && (
                    <p className="text-status-danger text-sm mt-1">
                        {errors.rating.message}
                    </p>
                )}
            </div>

            <div className="mt-3">
                <textarea
                    {...register("comment")}
                    rows={4}
                    placeholder="Tulis komentar Anda"
                    className="input-field"
                />
                {errors.comment && (
                    <p className="text-status-danger text-sm mt-1">
                        {errors.comment.message}
                    </p>
                )}
            </div>

            <div className="mt-3 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                >
                    {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
            </div>
        </form>
    );
}
