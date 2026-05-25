import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCreateBank, useUpdateBank } from "./useBankQueries";
import { bankFormSchema, type BankFormData } from "../schemas/bankFormSchema";
import type { Bank } from "../types";

export type { BankFormData };

const defaultValues: BankFormData = { name: "", code: "", logo_url: "" };

interface UseBankFormProps {
    editData?: Bank;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useBankForm({
    editData,
    onSuccess,
    onClose,
}: UseBankFormProps) {
    const createMutation = useCreateBank();
    const updateMutation = useUpdateBank();

    const form = useForm<BankFormData>({
        resolver: zodResolver(bankFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                code: editData.code,
                logo_url: editData.logo_url ?? "",
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const submitHandler = async (data: BankFormData) => {
        if (editData) {
            await updateMutation.mutateAsync(
                {
                    id: editData.id,
                    data: {
                        name: data.name,
                        code: data.code,
                        logo_url: data.logo_url || undefined,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success("Banco atualizado com sucesso.");
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar banco.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(
                {
                    name: data.name,
                    code: data.code,
                    logo_url: data.logo_url || undefined,
                },
                {
                    onSuccess: () => {
                        toast.success("Banco criado com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(error, "Erro ao criar banco."),
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
