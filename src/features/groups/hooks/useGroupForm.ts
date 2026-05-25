import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCreateGroup, useUpdateGroup } from "./useGroupQueries";
import {
    groupFormSchema,
    type GroupFormData,
    defaultValues,
} from "../schemas/groupFormSchema";
import type { Group } from "../types";

export type { GroupFormData };

interface UseGroupFormProps {
    editData?: Group;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useGroupForm({
    editData,
    onSuccess,
    onClose,
}: UseGroupFormProps) {
    const createMutation = useCreateGroup();
    const updateMutation = useUpdateGroup();

    const form = useForm<GroupFormData>({
        resolver: zodResolver(groupFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({ name: editData.name });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const submitHandler = async (data: GroupFormData) => {
        if (editData) {
            await updateMutation.mutateAsync(
                { id: editData.id, data: { name: data.name } },
                {
                    onSuccess: () => {
                        toast.success("Grupo atualizado com sucesso.");
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar grupo.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(
                { name: data.name },
                {
                    onSuccess: () => {
                        toast.success("Grupo criado com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(error, "Erro ao criar grupo."),
                        );
                    },
                },
            );
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
