import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCreateTransfer, useUpdateTransfer } from "./useTransferQueries";
import {
    transferFormSchema,
    type TransferFormData,
    defaultValues,
} from "../schemas/transferFormSchema";
import type { Transfer } from "../types";

export type { TransferFormData };

interface UseTransferFormProps {
    editData?: Transfer;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useTransferForm({
    editData,
    onSuccess,
    onClose,
}: UseTransferFormProps) {
    const createMutation = useCreateTransfer();
    const updateMutation = useUpdateTransfer();

    const form = useForm<TransferFormData>({
        resolver: zodResolver(transferFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                source_account: editData.source_account,
                destination_account: editData.destination_account,
                amount: editData.amount,
                transfer_date: editData.transfer_date,
                description: editData.description,
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const onSubmit = handleSubmit(async (values) => {
        if (editData) {
            await updateMutation.mutateAsync(
                {
                    id: editData.id,
                    data: {
                        amount: values.amount,
                        transfer_date: values.transfer_date,
                        description: values.description,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success("Transferência atualizada com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar transferência.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(values, {
                onSuccess: () => {
                    toast.success("Transferência criada com sucesso.");
                    reset(defaultValues);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(
                            error,
                            "Erro ao criar transferência.",
                        ),
                    );
                },
            });
        }
    });

    return { form, onDialogClose, isLoading, onSubmit };
}
