import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCreateAccount, useUpdateAccount } from "./useAccountQueries";
import {
    accountFormSchema,
    defaultValues,
    type AccountFormData,
} from "../schemas/accountFormSchema";
import type { Account } from "../types";

export type { AccountFormData };

interface UseAccountFormProps {
    editData?: Account;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useAccountForm({
    editData,
    onSuccess,
    onClose,
}: UseAccountFormProps) {
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();

    const form = useForm<AccountFormData>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                account_type: editData.account_type,
                bank: editData.bank,
                initial_balance: editData.initial_balance,
                is_active: editData.is_active,
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const submitHandler = async (data: AccountFormData) => {
        const payload = {
            name: data.name,
            account_type: data.account_type,
            bank: data.bank ?? null,
            initial_balance: data.initial_balance || undefined,
            is_active: data.is_active,
        };

        if (editData) {
            await updateMutation.mutateAsync(
                { id: editData.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Conta atualizada com sucesso.");
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar conta.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(payload, {
                onSuccess: () => {
                    toast.success("Conta criada com sucesso.");
                    reset(defaultValues);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(error, "Erro ao criar conta."),
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
