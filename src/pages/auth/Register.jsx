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
import Loader, { BarsSpinner } from "@/components/common/Loader";
import useRegion from "@/hooks/useRegion";
import useImagePreview from "@/hooks/useImagePreview";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/images/logo/logo-catalozy.svg";

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
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            store_name: "",
            store_description: "",
            pic_name: "",
            pic_phone: "",
            address: "",
            rt: "",
            rw: "",
            province_id: "",
            city_id: "",
            district_id: "",
            village_id: "",
            ktp_number: "",
            pic_image: null,
            ktp_file: null,
        },
    });

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
        // Get current form values
        const values = watch();

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
            // Manual validation for step 2
            const hasErrors =
                !values.store_name ||
                !values.pic_name ||
                !values.pic_phone ||
                !values.address ||
                !values.rt ||
                !values.rw ||
                !values.province_id ||
                !values.city_id ||
                !values.district_id ||
                !values.village_id;

            if (hasErrors) {
                // Trigger validation to show error messages
                await trigger([
                    "store_name",
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
                ok = false;
            } else {
                ok = true;
            }
        }

        if (ok) {
            setStep((s) => Math.min(3, s + 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            if (step === 2) {
                toast.error("Mohon lengkapi semua field yang diperlukan");
            }
        }
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            {isSubmitting && <Loader />}

            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-2xl">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <img
                                src={logo}
                                alt="Catalozy"
                                className="h-16 w-auto"
                            />
                            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                                Catalozy
                            </span>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Lengkapi Data Toko Anda
                        </h1>
                        <p className="text-gray-600">
                            Bergabunglah dengan ribuan penjual lokal dan
                            kembangkan bisnis Anda bersama Catalozy
                        </p>
                    </div>

                    {/* Centered Card */}
                    <div className="bg-white rounded-sm shadow-lg p-8 border border-gray-200">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* Stepper */}
                            <div className="mb-8 flex justify-center">
                                <OnboardingStepper step={step} steps={steps} />
                            </div>

                            {/* Step 1: Akun */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {steps[0]}
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <Input
                                            {...register("name")}
                                            placeholder="Masukkan nama lengkap"
                                            className="h-12"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            {...register("email")}
                                            placeholder="email@contoh.com"
                                            className="h-12"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <Input
                                                type="password"
                                                {...register("password")}
                                                placeholder="Minimal 6 karakter"
                                                className="h-12"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Konfirmasi Password
                                            </label>
                                            <Input
                                                type="password"
                                                {...register(
                                                    "password_confirmation"
                                                )}
                                                placeholder="Ulangi password"
                                                className="h-12"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {
                                                        errors
                                                            .password_confirmation
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 font-medium rounded-sm hover:bg-purple-50 transition"
                                            onClick={() => navigate("/login")}
                                        >
                                            Kembali
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-sm hover:bg-purple-700 transition"
                                            onClick={next}
                                        >
                                            Lanjut
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Data Toko */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Lengkapi Data Toko Anda
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Toko
                                        </label>
                                        <Input
                                            {...register("store_name")}
                                            placeholder="Contoh: Kerajinan Kayu Jepara"
                                            className="h-12"
                                        />
                                        {errors.store_name && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.store_name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deskripsi Toko
                                        </label>
                                        <textarea
                                            {...register("store_description")}
                                            placeholder="Ceritakan singkat tentang toko Anda..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            rows="4"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nama PIC (Penanggung Jawab)
                                            </label>
                                            <Input
                                                {...register("pic_name")}
                                                placeholder="Contoh: Budi Santoso"
                                                className="h-12"
                                            />
                                            {errors.pic_name && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.pic_name.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                No. HP PIC
                                            </label>
                                            <Input
                                                {...register("pic_phone")}
                                                placeholder="Contoh: 081234567890"
                                                className="h-12"
                                            />
                                            {errors.pic_phone && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.pic_phone.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alamat Toko
                                        </label>
                                        <textarea
                                            {...register("address")}
                                            placeholder="Jl. Contoh No. 123"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                            rows="3"
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                RT
                                            </label>
                                            <Input
                                                {...register("rt")}
                                                placeholder="Contoh: 01"
                                                className="h-12"
                                            />
                                            {errors.rt && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.rt.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                RW
                                            </label>
                                            <Input
                                                {...register("rw")}
                                                placeholder="Contoh: 05"
                                                className="h-12"
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Provinsi
                                            </label>
                                            <select
                                                {...register("province_id")}
                                                className="w-full h-12 px-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">
                                                    Jawa Tengah
                                                </option>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kota/Kabupaten
                                            </label>
                                            <select
                                                {...register("city_id")}
                                                disabled={
                                                    !watchedProvince ||
                                                    cityLoading
                                                }
                                                className="w-full h-12 px-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                                            >
                                                {cityLoading ? (
                                                    <option value="">
                                                        Memuat kota...
                                                    </option>
                                                ) : (
                                                    <>
                                                        <option value="">
                                                            Semarang
                                                        </option>
                                                        {cities.map((c) => (
                                                            <option
                                                                key={
                                                                    c.code ||
                                                                    c.id
                                                                }
                                                                value={
                                                                    c.code ||
                                                                    c.id
                                                                }
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kecamatan
                                            </label>
                                            <select
                                                {...register("district_id")}
                                                disabled={
                                                    !watchedCity ||
                                                    districtLoading
                                                }
                                                className="w-full h-12 px-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                                            >
                                                {districtLoading ? (
                                                    <option value="">
                                                        Memuat kecamatan...
                                                    </option>
                                                ) : (
                                                    <>
                                                        <option value="">
                                                            Pilih Kecamatan
                                                        </option>
                                                        {districts.map((d) => (
                                                            <option
                                                                key={
                                                                    d.code ||
                                                                    d.id
                                                                }
                                                                value={
                                                                    d.code ||
                                                                    d.id
                                                                }
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kelurahan
                                            </label>
                                            <select
                                                {...register("village_id")}
                                                disabled={
                                                    !watchedDistrict ||
                                                    villageLoading
                                                }
                                                className="w-full h-12 px-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                                            >
                                                {villageLoading ? (
                                                    <option value="">
                                                        Memuat kelurahan...
                                                    </option>
                                                ) : (
                                                    <>
                                                        <option value="">
                                                            Pilih Kelurahan
                                                        </option>
                                                        {villages.map((v) => (
                                                            <option
                                                                key={
                                                                    v.code ||
                                                                    v.id
                                                                }
                                                                value={
                                                                    v.code ||
                                                                    v.id
                                                                }
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

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-sm hover:bg-gray-50 transition"
                                            onClick={prev}
                                        >
                                            Kembali
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-sm hover:bg-purple-700 transition"
                                            onClick={next}
                                        >
                                            Lanjut
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Kredensial */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {steps[2]}
                                    </h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIK (KTP)
                                        </label>
                                        <Input
                                            {...register("ktp_number")}
                                            placeholder="16 digit NIK"
                                            className="h-12"
                                        />
                                        {errors.ktp_number && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.ktp_number.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto KTP (jpg/png)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleKtpChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            {ktp.previews && (
                                                <div className="mt-3">
                                                    <img
                                                        src={ktp.previews}
                                                        alt="preview-ktp"
                                                        className="w-full h-32 object-cover rounded-sm border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto Diri (jpg/png)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePicChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            {pic.previews && (
                                                <div className="mt-3">
                                                    <img
                                                        src={pic.previews}
                                                        alt="preview-pic"
                                                        className="w-full h-32 object-cover rounded-sm border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 font-medium rounded-sm hover:bg-purple-50 transition"
                                            onClick={prev}
                                        >
                                            Kembali
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-sm hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <BarsSpinner
                                                        size={18}
                                                        className="text-brand-purple"
                                                    />
                                                    Mendaftarkan...
                                                </>
                                            ) : (
                                                "Daftar sebagai Seller"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Footer */}
                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{" "}
                                <Link
                                    to="/login"
                                    className="text-purple-600 font-medium hover:text-purple-700"
                                >
                                    Masuk
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
