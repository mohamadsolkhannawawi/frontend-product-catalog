import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";

export default function useRegion() {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get(API_ENDPOINTS.PROVINCES);
                if (mounted) setProvinces(res.data || res);
            } catch (e) {
                // ignore
            }
        })();
        return () => (mounted = false);
    }, []);

    const loadCities = async (provinceCode) => {
        try {
            const res = await api.get(API_ENDPOINTS.CITIES(provinceCode));
            setCities(res.data || res);
        } catch (e) {
            setCities([]);
        }
    };

    const loadDistricts = async (cityCode) => {
        try {
            const res = await api.get(API_ENDPOINTS.DISTRICTS(cityCode));
            setDistricts(res.data || res);
        } catch (e) {
            setDistricts([]);
        }
    };

    const loadVillages = async (districtCode) => {
        try {
            const res = await api.get(API_ENDPOINTS.VILLAGES(districtCode));
            setVillages(res.data || res);
        } catch (e) {
            setVillages([]);
        }
    };

    return {
        provinces,
        cities,
        districts,
        villages,
        loadCities,
        loadDistricts,
        loadVillages,
    };
}
