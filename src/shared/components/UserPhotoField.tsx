import { UserRound } from "lucide-react";
import { ImageUploadField } from "@/shared/components/ImageUploadField";
import type { RefObject } from "react";

interface UserPhotoFieldProps {
    photoPreview: string | null;
    fileInputRef: RefObject<HTMLInputElement>;
    onPhotoChange: (file: File) => void;
    onPhotoRemove: () => void;
}

export function UserPhotoField({
    photoPreview,
    fileInputRef,
    onPhotoChange,
    onPhotoRemove,
}: UserPhotoFieldProps) {
    return (
        <ImageUploadField
            variant="avatar"
            preview={photoPreview}
            fileInputRef={fileInputRef}
            onFileChange={onPhotoChange}
            onRemove={onPhotoRemove}
            placeholder={<UserRound className="h-9 w-9" />}
        />
    );
}
