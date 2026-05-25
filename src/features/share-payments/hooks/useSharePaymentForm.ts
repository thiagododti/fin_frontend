import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    useCreateSharePayment,
    useUpdateSharePayment,
} from "./useSharePaymentQueries";
import {
    sharePaymentFormSchema,
    type SharePaymentFormData,
    defaultValues,
} from "../schemas/sharePaymentFormSchema";
import type { SharePayment } from "../types";

export type { SharePaymentFormData };

interface UseSharePaymentFormProps {
    editData?: SharePayment;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useSharePaymentForm({
    editData,
    onSuccess,
    onClose,
}: UseSharePaymentFormProps) {
    const createMutation = useCreateSharePayment();
    const updateMutation = useUpdateSharePayment();

    const form = useForm<SharePaymentFormData>({
        resolver: zodResolver(sharePaymentFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (editData) {
            reset({
                transaction_share: editData.transaction_share,
                amount: editData.amount,
                payment_date: editData.payment_date,
                notes: editData.notes,
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
                        payment_date: values.payment_date,
                        notes: values.notes,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success("Pagamento atualizado com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao atualizar pagamento.",
                            ),
                        );
                    },
                },
            );
        } else {
            await createMutation.mutateAsync(
                values as Required<typeof values>,
                {
                    onSuccess: () => {
                        toast.success("Pagamento registrado com sucesso.");
                        reset(defaultValues);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast.error(
                            getApiErrorMessage(
                                error,
                                "Erro ao registrar pagamento.",
                            ),
                        );
                    },
                },
            );
        }
    });

    return { form, onDialogClose, isLoading, onSubmit };
}
