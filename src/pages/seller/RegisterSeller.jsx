import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OnboardingStepper from "@/components/features/seller/OnboardingStepper";
import ImageUploader from "@/components/features/seller/ImageUploader";
import useRegion from "@/hooks/useRegion";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function RegisterSeller() {
    const steps = ["Store Info", "Address", "Documents", "Complete"];
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

    const [store, setStore] = useState({
        store_name: "",
        store_description: "",
        phone: "",
    });
    const [address, setAddress] = useState({
        province: "",
        city: "",
        district: "",
        village: "",
        address: "",
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    function next() {
        setStep((s) => Math.min(4, s + 1));
    }
    function prev() {
        setStep((s) => Math.max(1, s - 1));
    }

    const submit = async () => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append("store_name", store.store_name);
            form.append("store_description", store.store_description);
            form.append("phone", store.phone);
            form.append("province_id", address.province);
            form.append("city_id", address.city);
            form.append("district_id", address.district);
            form.append("village_id", address.village);
            form.append("address", address.address);
            // append files
            files.forEach((f, idx) =>
                form.append("files[]", f, f.name || `file_${idx}`)
            );

            await api.post("/seller/onboard", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(
                "Pendaftaran seller terkirim. Mohon tunggu verifikasi."
            );
            next();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Gagal mengirim pendaftaran"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
                <OnboardingStepper step={step} steps={steps} />

                {step === 1 && (
                    <div className="card">
                        <h3 className="font-semibold">Store Information</h3>
                        <div className="mt-3 grid grid-cols-1 gap-3">
                            <input
                                className="input-field"
                                placeholder="Store name"
                                value={store.store_name}
                                onChange={(e) =>
                                    setStore({
                                        ...store,
                                        store_name: e.target.value,
                                    })
                                }
                            />
                            <textarea
                                className="input-field"
                                placeholder="Store description"
                                value={store.store_description}
                                onChange={(e) =>
                                    setStore({
                                        ...store,
                                        store_description: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="input-field"
                                placeholder="Phone"
                                value={store.phone}
                                onChange={(e) =>
                                    setStore({
                                        ...store,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="btn-primary" onClick={next}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="card">
                        <h3 className="font-semibold">Address</h3>
                        <div className="mt-3 grid grid-cols-1 gap-3">
                            <select
                                className="input-field"
                                value={address.province}
                                onChange={(e) => {
                                    setAddress({
                                        ...address,
                                        province: e.target.value,
                                    });
                                    loadCities(e.target.value);
                                }}
                            >
                                <option value="">Pilih Provinsi</option>
                                {provinces.map((p) => (
                                    <option
                                        key={p.code || p.id}
                                        value={p.code || p.id}
                                    >
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="input-field"
                                value={address.city}
                                onChange={(e) => {
                                    setAddress({
                                        ...address,
                                        city: e.target.value,
                                    });
                                    loadDistricts(e.target.value);
                                }}
                            >
                                <option value="">Pilih Kota</option>
                                {cities.map((c) => (
                                    <option
                                        key={c.code || c.id}
                                        value={c.code || c.id}
                                    >
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="input-field"
                                value={address.district}
                                onChange={(e) => {
                                    setAddress({
                                        ...address,
                                        district: e.target.value,
                                    });
                                    loadVillages(e.target.value);
                                }}
                            >
                                <option value="">Pilih Kecamatan</option>
                                {districts.map((d) => (
                                    <option
                                        key={d.code || d.id}
                                        value={d.code || d.id}
                                    >
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="input-field"
                                value={address.village}
                                onChange={(e) =>
                                    setAddress({
                                        ...address,
                                        village: e.target.value,
                                    })
                                }
                            >
                                <option value="">Pilih Kelurahan</option>
                                {villages.map((v) => (
                                    <option
                                        key={v.code || v.id}
                                        value={v.code || v.id}
                                    >
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                className="input-field"
                                placeholder="Alamat lengkap"
                                value={address.address}
                                onChange={(e) =>
                                    setAddress({
                                        ...address,
                                        address: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="btn-secondary" onClick={prev}>
                                Back
                            </button>
                            <button className="btn-primary" onClick={next}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="card">
                        <h3 className="font-semibold">Documents</h3>
                        <div className="mt-3">
                            <ImageUploader
                                onChange={(files) => setFiles(files)}
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="btn-secondary" onClick={prev}>
                                Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={submit}
                                disabled={loading}
                            >
                                {loading ? "Mengirim..." : "Submit"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="card text-center">
                        <h3 className="font-semibold">Complete</h3>
                        <p className="mt-3 text-brand-gray-500">
                            Pendaftaran Anda telah dikirim. Mohon tunggu
                            konfirmasi dari admin.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
