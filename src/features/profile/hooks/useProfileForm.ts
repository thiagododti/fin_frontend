import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuth } from "@/features/auth/hooks";
import { useUpdateMe } from "./useProfileQueries";
import {
    profileSchema,
    type ProfileFormValues,
} from "../schemas/profileSchema";
import type { ProfileUpdate } from "../types";

export type { ProfileFormValues };

interface UseProfileFormProps {
    open: boolean;
    onClose: () => void;
}

export function useProfileForm({ open, onClose }: UseProfileFormProps) {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            birth_date: "",
        },
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (open && user) {
            reset({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                birth_date: user.birth_date ?? "",
            });
            setPhotoPreview(user.photo ?? null);
            setPhotoFile(undefined);
        }
    }, [open, user, reset]);

    const updateMutation = useUpdateMe();

    const onSubmit = handleSubmit((values: ProfileFormValues) => {
        if (!user) return;
        const patch: ProfileUpdate = {
            first_name: values.first_name,
            last_name: values.last_name,
            birth_date: values.birth_date,
            ...(photoFile ? { photo: photoFile } : {}),
        };
        updateMutation.mutate(patch, {
            onSuccess: (updated) => {
                updateUser({ ...user, ...updated });
                toast.success("Perfil atualizado com sucesso!");
                onClose();
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Erro ao atualizar perfil. Tente novamente.",
                    ),
                );
            },
        });
    });

    const resetPhoto = () => {
        setPhotoPreview(null);
        setPhotoFile(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return {
        form,
        onSubmit,
        isPending: updateMutation.isPending,
        photoPreview,
        setPhotoPreview,
        photoFile,
        setPhotoFile,
        fileInputRef,
        resetPhoto,
    };
}
