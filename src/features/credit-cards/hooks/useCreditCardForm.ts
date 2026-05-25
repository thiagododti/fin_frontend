import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    useCreateCreditCard,
    useUpdateCreditCard,
} from "./useCreditCardQueries";
import {
    creditCardFormSchema,
    type CreditCardFormData,
    defaultValues,
} from "../schemas/creditCardFormSchema";
import type { CreditCard } from "../types";

export type { CreditCardFormData };

interface UseCreditCardFormProps {
    editData?: CreditCard;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useCreditCardForm({
    editData,
    onSuccess,
    onClose,
}: UseCreditCardFormProps) {
    const createMutation = useCreateCreditCard();
    const updateMutation = useUpdateCreditCard();

    const form = useForm<CreditCardFormData>({
        resolver: zodResolver(creditCardFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                name: editData.name,
                bank: editData.bank,
                limit_amount: editData.limit_amount,
                closing_day: editData.closing_day,
                due_day: editData.due_day,
                is_active: editData.is_active,
            });
        }
    }, [editData, reset]);

    const onDialogClose = () => {
        reset(defaultValues);
        onClose?.();
    };

    const submitHandler = async (data: CreditCardFormData) => {
        if (editData) {
            await updateMutation.mutateAsync(
                {
                    id: editData.id,
                    data: {
                        name: data.name,
                        bank: data.bank ?? null,
                        limit_amount: data.limit_amount,
                        closing_day: data.closing_day,
                        due_day: data.due_day,
                        is_active: data.is_active,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success("Cartão atualizado com sucesso.");
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar cartão.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(
                {
                    name: data.name,
                    bank: data.bank ?? null,
                    limit_amount: data.limit_amount,
                    closing_day: data.closing_day,
                    due_day: data.due_day,
                    is_active: data.is_active,
                },
                {
                    onSuccess: () => {
                        toast.success("Cartão criado com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(error, "Erro ao criar cartão."),
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
