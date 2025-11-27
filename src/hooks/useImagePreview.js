import { useState, useEffect } from "react";

export default function useImagePreview(initial = null, multiple = false) {
    const [files, setFiles] = useState(initial);
    const [previews, setPreviews] = useState(multiple ? [] : null);

    useEffect(() => {
        // cleanup previous previews when files change
        let urls = [];
        if (!files) {
            setPreviews(multiple ? [] : null);
            return;
        }

        if (multiple) {
            const arr = Array.from(files);
            urls = arr.map((f) => URL.createObjectURL(f));
            setPreviews(urls);
        } else {
            const f = files;
            const url = f ? URL.createObjectURL(f) : null;
            setPreviews(url);
            if (url) urls = [url];
        }

        return () => {
            urls.forEach((u) => {
                try {
                    URL.revokeObjectURL(u);
                } catch (e) {}
            });
        };
    }, [files, multiple]);

    const handleFileChange = (e) => {
        if (!e || !e.target) return;
        const f = multiple ? e.target.files : e.target.files[0];
        setFiles(f && f.length === 0 ? null : f);
    };

    const clear = () => {
        setFiles(null);
        setPreviews(multiple ? [] : null);
    };

    return { files, previews, setFiles, handleFileChange, clear };
}
