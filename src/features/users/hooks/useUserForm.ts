import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser, useUpdateUser } from "./useUserQueries";
import { usePhotoUpload } from "@/shared/hooks/usePhotoUpload";
import type { UserUpdate, UserEditData } from "../types";
import {
    userFormSchema,
    defaultValues,
    type UserFormData,
} from "../schemas/userFormSchema";

// ─── Hook ─────────────────────────────────────────────────────────────────────

type UseUserFormProps = {
    editData?: UserEditData;
    onSuccess?: () => void;
    onClose?: () => void;
};

export function useUserForm({
    editData,
    onSuccess,
    onClose,
}: UseUserFormProps) {
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const photo = usePhotoUpload();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        mode: "onBlur",
        defaultValues,
    });

    const { reset, handleSubmit, setError } = form;
    const { setPhotoPreview } = photo;

    useEffect(() => {
        if (editData) {
            reset({
                username: editData.username,
                email: editData.email,
                first_name: editData.first_name,
                last_name: editData.last_name,
                birth_date: editData.birth_date || "",
                is_active: editData.is_active ?? true,
                is_staff: editData.is_staff ?? false,
                is_superuser: editData.is_superuser ?? false,
                password: "",
                password2: "",
            });
            setPhotoPreview(editData.photo || null);
        }
    }, [editData, reset, setPhotoPreview]);

    const submitHandler = async (data: UserFormData) => {
        if (!editData && !data.password) {
            setError("password", { message: "Senha é obrigatória" });
            return;
        }
        if (!editData && !data.password2) {
            setError("password2", {
                message: "Confirmação de senha é obrigatória",
            });
            return;
        }
        try {
            if (editData) {
                const updateData: UserUpdate = {
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    birth_date: data.birth_date,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                };
                if (data.password) {
                    updateData.password = data.password;
                    updateData.password2 = data.password2; // ✅ adicionar
                }
                if (photo.photoFile) updateData.photo = photo.photoFile;
                await updateMutation.mutateAsync({
                    id: editData.id,
                    data: updateData,
                });
            } else {
                await createMutation.mutateAsync({
                    username: data.username,
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    birth_date: data.birth_date,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    is_superuser: data.is_superuser,
                    password: data.password ?? "",
                    password2: data.password2 ?? "",
                    photo: photo.photoFile,
                });
            }
            reset(defaultValues);
            photo.resetPhoto();
            onSuccess?.();
        } catch {
            // erro tratado pelo onError da mutation
        }
    };

    const onDialogClose = () => {
        reset(defaultValues);
        photo.resetPhoto();
        onClose?.();
    };

    return {
        form,
        onDialogClose,
        isLoading: createMutation.isPending || updateMutation.isPending,
        // photo (spread para manter API pública idêntica)
        ...photo,
        onSubmit: handleSubmit(submitHandler),
    };
}
