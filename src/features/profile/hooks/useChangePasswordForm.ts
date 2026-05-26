import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "./useProfileQueries";
import {
    changePasswordSchema,
    type ChangePasswordFormData,
} from "../schemas/changePasswordSchema";

type UseChangePasswordFormProps = {
    onClose: () => void;
};

export function useChangePasswordForm({ onClose }: UseChangePasswordFormProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onBlur",
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const { mutate, isPending } = useChangePassword();

    const onSubmit = form.handleSubmit((data: ChangePasswordFormData) =>
        mutate(data, {
            onSuccess: () => {
                form.reset();
                onClose();
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
