import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/shared/hooks/useAuth";
import { useUpdateMe } from "./useProfileQueries";
import { usePhotoUpload } from "@/shared/hooks/usePhotoUpload";
import {
    profileSchema,
    type ProfileFormValues,
} from "../schemas/profileSchema";
import type { ProfileUpdate } from "../types";

type UseProfileFormProps = {
    open: boolean;
    onClose: () => void;
};

export function useProfileForm({ open, onClose }: UseProfileFormProps) {
    const { user } = useAuth();
    const photo = usePhotoUpload();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        mode: "onBlur",
        defaultValues: {
            first_name: "",
            last_name: "",
            birth_date: "",
        },
    });

    const { reset, handleSubmit } = form;
    const { setPhotoPreview, setPhotoFile } = photo;

    useEffect(() => {
        if (open && user) {
            reset({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                birth_date: user.birth_date ?? "",
            });
            setPhotoPreview(user.photo ?? null);
            setPhotoFile(undefined);
        }
    }, [open, user, reset, setPhotoPreview, setPhotoFile]);

    const updateMutation = useUpdateMe();

    const onSubmit = handleSubmit((values: ProfileFormValues) => {
        if (!user) return;
        const patch: ProfileUpdate = {
            first_name: values.first_name,
            last_name: values.last_name,
            birth_date: values.birth_date,
            ...(photo.photoFile ? { photo: photo.photoFile } : {}),
        };
        updateMutation.mutate(patch, {
            onSuccess: () => {
                onClose();
            },
        });
    });

    return {
        form,
        onSubmit,
        isPending: updateMutation.isPending,
        ...photo,
    };
}
