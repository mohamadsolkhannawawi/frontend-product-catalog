import React, { useState, useEffect } from "react";
import OnboardingStepper from "@/components/features/seller/OnboardingStepper";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";
import Input from "@/components/common/Input";
import useRegion from "@/hooks/useRegion";
import useImagePreview from "@/hooks/useImagePreview";

const schema = z
    .object({
        // User
        name: z.string().min(1, "Nama lengkap wajib diisi"),
        email: z
            .string()
            .min(1, "Email wajib diisi")
            .email("Email tidak valid"),
        password: z.string().min(6, "Minimal 6 karakter"),
        password_confirmation: z.string().min(6, "Konfirmasi password wajib"),

        // Seller onboarding
        store_name: z.string().min(1, "Nama toko wajib diisi"),
        store_description: z.string().optional(),

        pic_name: z.string().min(1, "Nama PIC wajib diisi"),
        pic_phone: z.string().min(1, "No. HP PIC wajib diisi"),

        address: z.string().min(1, "Alamat wajib diisi"),
        rt: z.string().min(1, "RT wajib diisi"),
        rw: z.string().min(1, "RW wajib diisi"),

        province_id: z.string().min(1, "Provinsi wajib diisi"),
        city_id: z.string().min(1, "Kota/Kabupaten wajib diisi"),
        district_id: z.string().min(1, "Kecamatan wajib diisi"),
        village_id: z.string().min(1, "Kelurahan wajib diisi"),

        ktp_number: z.string().length(16, "NIK harus 16 digit"),

        pic_image: z.any().optional(),
        ktp_file: z.any().optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Password dan konfirmasi tidak cocok",
        path: ["password_confirmation"],
    });

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    const steps = ["Akun", "Data Toko", "Kredensial"];
    const [step, setStep] = useState(1);

    const {
        provinces,
        cities,
        districts,
        villages,
        loadCities,
        loadDistricts,
        loadVillages,
    } = useRegion();
    const pic = useImagePreview(null, false);
    const ktp = useImagePreview(null, false);

    // loading flags for hierarchical selects
    const [cityLoading, setCityLoading] = useState(false);
    const [districtLoading, setDistrictLoading] = useState(false);
    const [villageLoading, setVillageLoading] = useState(false);

    // watch parent selects
    const watchedProvince = watch("province_id");
    const watchedCity = watch("city_id");
    const watchedDistrict = watch("district_id");

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!watchedProvince) {
                // clear downstream values
                try {
                    setValue("city_id", "");
                    setValue("district_id", "");
                    setValue("village_id", "");
                } catch (e) {}
                return;
            }

            setCityLoading(true);
            try {
                await loadCities(watchedProvince);
                if (mounted) {
                    // clear downstream
                    setValue("city_id", "");
                    setValue("district_id", "");
                    setValue("village_id", "");
                }
            } catch (e) {
                // ignore
            } finally {
                if (mounted) setCityLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [watchedProvince]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!watchedCity) {
                try {
                    setValue("district_id", "");
                    setValue("village_id", "");
                } catch (e) {}
                return;
            }

            setDistrictLoading(true);
            try {
                await loadDistricts(watchedCity);
                if (mounted) {
                    setValue("district_id", "");
                    setValue("village_id", "");
                }
            } catch (e) {
                // ignore
            } finally {
                if (mounted) setDistrictLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [watchedCity]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!watchedDistrict) {
                try {
                    setValue("village_id", "");
                } catch (e) {}
                return;
            }

            setVillageLoading(true);
            try {
                await loadVillages(watchedDistrict);
                if (mounted) setValue("village_id", "");
            } catch (e) {
                // ignore
            } finally {
                if (mounted) setVillageLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [watchedDistrict]);

    // File validation
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png"];

    const handleKtpChange = (e) => {
        const f = e?.target?.files?.[0];
        if (!f) {
            ktp.handleFileChange(e);
            return;
        }
        if (!ALLOWED_TYPES.includes(f.type)) {
            toast.error("Format file harus JPG/PNG");
            return;
        }
        if (f.size > MAX_FILE_SIZE) {
            toast.error("Ukuran file maksimal 2MB");
            return;
        }
        ktp.handleFileChange(e);
    };

    const handlePicChange = (e) => {
        const f = e?.target?.files?.[0];
        if (!f) {
            pic.handleFileChange(e);
            return;
        }
        if (!ALLOWED_TYPES.includes(f.type)) {
            toast.error("Format file harus JPG/PNG");
            return;
        }
        if (f.size > MAX_FILE_SIZE) {
            toast.error("Ukuran file maksimal 2MB");
            return;
        }
        pic.handleFileChange(e);
    };

    const next = async () => {
        // validate fields per step
        let ok = false;
        if (step === 1) {
            ok = await trigger([
                "name",
                "email",
                "password",
                "password_confirmation",
            ]);
        } else if (step === 2) {
            ok = await trigger([
                "store_name",
                "store_description",
                "pic_name",
                "pic_phone",
                "address",
                "rt",
                "rw",
                "province_id",
                "city_id",
                "district_id",
                "village_id",
            ]);
        }

        if (ok) setStep((s) => Math.min(3, s + 1));
    };

    const prev = () => setStep((s) => Math.max(1, s - 1));

    async function onSubmit(values) {
        // Validasi dilakukan otomatis oleh backend saat submit
        try {
            const fd = new FormData();
            fd.append("name", values.name);
            fd.append("email", values.email);
            fd.append("password", values.password);
            fd.append("password_confirmation", values.password_confirmation);

            fd.append("store_name", values.store_name);
            fd.append("store_description", values.store_description || "");

            fd.append("pic_name", values.pic_name);
            fd.append("pic_phone", values.pic_phone);

            fd.append("address", values.address);
            fd.append("rt", values.rt);
            fd.append("rw", values.rw);

            fd.append("province_id", values.province_id);
            fd.append("city_id", values.city_id);
            fd.append("district_id", values.district_id);
            fd.append("village_id", values.village_id);

            fd.append("ktp_number", values.ktp_number);

            if (pic.files) fd.append("pic_image", pic.files);
            if (ktp.files) fd.append("ktp_file", ktp.files);

            const response = await api.post(API_ENDPOINTS.REGISTER, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Save Bearer Token from response
            if (response.data.token) {
                localStorage.setItem("auth_token", response.data.token);
            }

            toast.success(
                "Pendaftaran berhasil dikirim. Tunggu persetujuan admin."
            );
            navigate("/");
        } catch (err) {
            if (err?.response?.data?.errors) {
                const first = Object.values(err.response.data.errors)[0];
                toast.error(Array.isArray(first) ? first[0] : String(first));
            } else {
                const msg = err?.response?.data?.message || "Pendaftaran gagal";
                toast.error(msg);
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="max-w-2xl mx-auto px-6 py-12 flex-1">
                <h1 className="text-2xl font-bold mb-4">
                    Daftar & Ajukan Seller
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <OnboardingStepper step={step} steps={steps} />

                    {step === 1 && (
                        <div>
                            <h2 className="text-lg font-semibold">Akun</h2>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Fullname
                                </label>
                                <Input
                                    {...register("name")}
                                    placeholder="Nama lengkap"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Password
                                    </label>
                                    <Input
                                        type="password"
                                        {...register("password")}
                                        placeholder="Minimal 6 karakter"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Konfirmasi Password
                                    </label>
                                    <Input
                                        type="password"
                                        {...register("password_confirmation")}
                                        placeholder="Ulangi password"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {
                                                errors.password_confirmation
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn-primary ml-auto"
                                    onClick={next}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-lg font-semibold">Data Toko</h2>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nama Toko
                                </label>
                                <Input
                                    {...register("store_name")}
                                    placeholder="Nama toko"
                                />
                                {errors.store_name && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.store_name.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deskripsi Toko
                                </label>
                                <Input
                                    {...register("store_description")}
                                    placeholder="Deskripsi singkat"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nama PIC
                                    </label>
                                    <Input
                                        {...register("pic_name")}
                                        placeholder="Nama penanggung jawab"
                                    />
                                    {errors.pic_name && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.pic_name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        No. HP PIC
                                    </label>
                                    <Input
                                        {...register("pic_phone")}
                                        placeholder="0812xxxx"
                                    />
                                    {errors.pic_phone && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.pic_phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Alamat Jalan PIC
                                </label>
                                <Input
                                    {...register("address")}
                                    placeholder="Alamat lengkap"
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        RT
                                    </label>
                                    <Input
                                        {...register("rt")}
                                        placeholder="RT"
                                    />
                                    {errors.rt && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.rt.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        RW
                                    </label>
                                    <Input
                                        {...register("rw")}
                                        placeholder="RW"
                                    />
                                    {errors.rw && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.rw.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Provinsi
                                    </label>
                                    <select
                                        {...register("province_id")}
                                        className="input"
                                    >
                                        <option value="">Pilih provinsi</option>
                                        {provinces.map((p) => (
                                            <option
                                                key={p.code || p.id}
                                                value={p.code || p.id}
                                            >
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.province_id.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Kota/Kab.
                                    </label>
                                    <select
                                        {...register("city_id")}
                                        disabled={
                                            !watchedProvince || cityLoading
                                        }
                                        className="input"
                                    >
                                        {cityLoading ? (
                                            <option value="">
                                                Memuat kota...
                                            </option>
                                        ) : (
                                            <>
                                                <option value="">
                                                    Pilih kota
                                                </option>
                                                {cities.map((c) => (
                                                    <option
                                                        key={c.code || c.id}
                                                        value={c.code || c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    {errors.city_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.city_id.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Kecamatan
                                    </label>
                                    <select
                                        {...register("district_id")}
                                        disabled={
                                            !watchedCity || districtLoading
                                        }
                                        className="input"
                                    >
                                        {districtLoading ? (
                                            <option value="">
                                                Memuat kecamatan...
                                            </option>
                                        ) : (
                                            <>
                                                <option value="">
                                                    Pilih kecamatan
                                                </option>
                                                {districts.map((d) => (
                                                    <option
                                                        key={d.code || d.id}
                                                        value={d.code || d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    {errors.district_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.district_id.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Kelurahan
                                    </label>
                                    <select
                                        {...register("village_id")}
                                        disabled={
                                            !watchedDistrict || villageLoading
                                        }
                                        className="input"
                                    >
                                        {villageLoading ? (
                                            <option value="">
                                                Memuat kelurahan...
                                            </option>
                                        ) : (
                                            <>
                                                <option value="">
                                                    Pilih kelurahan
                                                </option>
                                                {villages.map((v) => (
                                                    <option
                                                        key={v.code || v.id}
                                                        value={v.code || v.id}
                                                    >
                                                        {v.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    {errors.village_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.village_id.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    className="btn-secondary"
                                    type="button"
                                    onClick={prev}
                                >
                                    Back
                                </button>
                                <button
                                    className="btn-primary ml-auto"
                                    type="button"
                                    onClick={next}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold">
                                Data Kredensial
                            </h2>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    NIK (KTP)
                                </label>
                                <Input
                                    {...register("ktp_number")}
                                    placeholder="16 digit NIK"
                                />
                                {errors.ktp_number && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.ktp_number.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Photo KTP PIC (jpg/png)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleKtpChange}
                                    />
                                    {ktp.previews && (
                                        <div className="mt-2">
                                            <img
                                                src={ktp.previews}
                                                alt="preview-ktp"
                                                className="w-48 h-28 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Photo PIC (jpg/png)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePicChange}
                                    />
                                    {pic.previews && (
                                        <div className="mt-2">
                                            <img
                                                src={pic.previews}
                                                alt="preview-pic"
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    className="btn-secondary"
                                    type="button"
                                    onClick={prev}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary ml-auto"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Mendaftarkan..."
                                        : "Daftar sebagai Seller"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <p className="text-sm text-brand-gray-600 mt-4">
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-brand-primary">
                        Masuk
                    </Link>
                </p>
            </main>
        </div>
    );
}
