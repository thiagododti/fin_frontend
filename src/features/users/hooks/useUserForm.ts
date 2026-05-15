import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser } from "../hooks";
import { useUserPhotoUpload } from "./useUserPhotoUpload";
import type { UserUpdate } from "../types";
import {
    userFormSchema,
    defaultValues,
    type UserFormData,
    type UserEditData,
} from "../schemas/userFormSchema";

export type { UserFormData, UserEditData };

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseUserFormProps {
    open: boolean;
    editData?: UserEditData;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useUserForm({
    open,
    editData,
    onSuccess,
    onClose,
}: UseUserFormProps) {
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const photo = useUserPhotoUpload();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setError } = form;

    useEffect(() => {
        if (editData) {
            reset({
                username: editData.username,
                email: editData.email,
                first_name: editData.first_name,
                last_name: editData.last_name,
                telephone: editData.telephone || "",
                birth_date: editData.birth_date || "",
                department: editData.department ?? undefined,
                is_active: editData.is_active ?? true,
                is_staff: editData.is_staff ?? false,
                is_superuser: editData.is_superuser ?? false,
                password: "",
                password2: "",
            });
            photo.setPhotoPreview(editData.photo || null);
        }
    }, [editData, reset]); // eslint-disable-line react-hooks/exhaustive-deps

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
                    password: data.password!,
                    password2: data.password2!,
                    photo: photo.photoFile,
                });
            }
            reset(defaultValues);
            photo.resetPhoto();
            onSuccess?.();
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            toast.error(
                "Erro ao salvar usuário. Verifique os dados e tente novamente.",
            );
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
