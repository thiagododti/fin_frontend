import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCreateCategory, useUpdateCategory } from "./useCategoryQueries";
import {
    categoryFormSchema,
    defaultValues,
    type CategoryFormData,
} from "../schemas/categoryFormSchema";
import type { Category } from "../types";

export type { CategoryFormData };

interface UseCategoryFormProps {
    editData?: Category;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useCategoryForm({
    editData,
    onSuccess,
    onClose,
}: UseCategoryFormProps) {
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                type: editData.type,
                color: editData.color ?? "",
                icon: editData.icon ?? "",
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const submitHandler = async (data: CategoryFormData) => {
        const payload = {
            name: data.name,
            type: data.type,
            color: data.color || undefined,
            icon: data.icon || undefined,
        };

        if (editData) {
            await updateMutation.mutateAsync(
                { id: editData.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Categoria atualizada com sucesso.");
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar categoria.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(payload, {
                onSuccess: () => {
                    toast.success("Categoria criada com sucesso.");
                    reset(defaultValues);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(error, "Erro ao criar categoria."),
                    );
                },
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return {
        form,
        onDialogClose,
        isLoading,
        onSubmit: handleSubmit(submitHandler),
    };
}
