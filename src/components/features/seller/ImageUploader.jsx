import React, { useRef, useEffect } from "react";
import useImagePreview from "@/hooks/useImagePreview";

export default function ImageUploader({ value = [], onChange }) {
    const fileRef = useRef();
    const { files, previews, setFiles, handleFileChange, clear } =
        useImagePreview(null, true);

    useEffect(() => {
        // notify parent when files change
        if (onChange) {
            if (!files) onChange([]);
            else onChange(Array.from(files));
        }
        // Intentionally omit `onChange` from deps to avoid re-running when parent
        // passes an inline callback that changes on every render. We only want
        // to notify when `files` actually changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
        <div>
            <div className="border-2 border-dashed border-brand-gray-200 rounded-md p-4 text-center">
                <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                        handleFileChange(e);
                    }}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            fileRef.current && fileRef.current.click()
                        }
                        className="btn-secondary"
                    >
                        Pilih Gambar
                    </button>
                    {previews && previews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {previews.map((p, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={p}
                                        alt={`preview-${idx}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {previews && previews.length > 0 && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    clear();
                                    if (fileRef.current)
                                        fileRef.current.value = null;
                                }}
                                className="btn-secondary"
                            >
                                Hapus
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
