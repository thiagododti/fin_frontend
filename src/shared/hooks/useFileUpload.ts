import { useState, useRef } from "react";

export interface UseFileUploadReturn {
    file: File | undefined;
    setFile: (file: File | undefined) => void;
    preview: string | null;
    setPreview: (preview: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (file: File) => void;
    reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (newFile: File) => {
        setFile(newFile);
        setPreview(URL.createObjectURL(newFile));
    };

    const reset = () => {
        setFile(undefined);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return {
        file,
        setFile,
        preview,
        setPreview,
        fileInputRef,
        handleFileChange,
        reset,
    };
}
