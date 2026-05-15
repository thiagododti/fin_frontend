import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks";
import { usersApi } from "../api";
import {
    profileSchema,
    type ProfileFormValues,
} from "../schemas/profileSchema";
import type { UserUpdate } from "../types";

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
            email: "",
            birth_date: "",
        },
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (open && user) {
            reset({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                email: user.email ?? "",
                birth_date: user.birth_date ?? "",
            });
            setPhotoPreview(user.photo ?? null);
            setPhotoFile(undefined);
        }
    }, [open, user, reset]);

    const mutation = useMutation({
        mutationFn: (values: ProfileFormValues) => {
            if (!user) throw new Error("Usuário não autenticado");
            const patch: UserUpdate = {
                username: user.username,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email || undefined,
                birth_date: values.birth_date,
                ...(photoFile ? { photo: photoFile } : {}),
            };
            return usersApi.patch(user.id, patch);
        },
        onSuccess: ({ data }) => {
            updateUser(data);
            toast.success("Perfil atualizado com sucesso!");
            onClose();
        },
        onError: () => {
            toast.error("Erro ao atualizar perfil. Tente novamente.");
        },
    });

    const onSubmit = handleSubmit((values) => mutation.mutate(values));

    const resetPhoto = () => {
        setPhotoPreview(null);
        setPhotoFile(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return {
        form,
        onSubmit,
        isPending: mutation.isPending,
        photoPreview,
        setPhotoPreview,
        photoFile,
        setPhotoFile,
        fileInputRef,
        resetPhoto,
    };
}
