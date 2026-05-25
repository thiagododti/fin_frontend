import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import { useChangePassword } from "./useProfileQueries";
import {
    changePasswordSchema,
    type ChangePasswordFormData,
} from "../schemas/changePasswordSchema";

export type { ChangePasswordFormData };

interface UseChangePasswordFormProps {
    onClose: () => void;
}

export function useChangePasswordForm({ onClose }: UseChangePasswordFormProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const { mutate, isPending } = useChangePassword();

    const onSubmit = form.handleSubmit((data: ChangePasswordFormData) =>
        mutate(data, {
            onSuccess: () => {
                toast.success("Senha alterada com sucesso!");
                form.reset();
                onClose();
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Falha ao alterar senha. Verifique a senha atual e tente novamente.",
                    ),
                );
            },
        }),
    );

    const handleOpenChange = (v: boolean) => {
        if (!v) form.reset();
        onClose();
    };

    return {
        form,
        onSubmit,
        isPending,
        handleOpenChange,
        showCurrent,
        setShowCurrent,
        showNew,
        setShowNew,
        showConfirm,
        setShowConfirm,
    };
}
