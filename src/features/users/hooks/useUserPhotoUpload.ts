import { useFileUpload } from "@/shared/hooks/useFileUpload";

export function useUserPhotoUpload() {
    const {
        file: photoFile,
        setFile: setPhotoFile,
        preview: photoPreview,
        setPreview: setPhotoPreview,
        fileInputRef,
        reset: resetPhoto,
    } = useFileUpload();

    return {
        photoFile,
        setPhotoFile,
        photoPreview,
        setPhotoPreview,
        fileInputRef,
        resetPhoto,
    };
}
