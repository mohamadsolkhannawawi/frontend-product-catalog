import { useState, useCallback } from "react";
import api from "@/lib/axios";

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async (method, url, data = null, config = {}) => {
            setLoading(true);
            setError(null);
            try {
                const response = await api[method](url, data, config);
                setLoading(false);
                return response.data;
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "An error occurred"
                );
                setLoading(false);
                throw err;
            }
        },
        []
    );

    return { request, loading, error };
};

export default useApi;
