import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "../profileService";
import { profileKeys } from "../profile.keys";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuth } from "@/shared/hooks/useAuth";
import type { ProfileUpdate, ChangePassword } from "../types";
import type { ProfileUser } from "../schemas/profileUserSchema";

export function useMe() {
    return useQuery({
        queryKey: profileKeys.me(),
        queryFn: () => profileApi.me(),
    });
}

export function useUpdateMe() {
    const qc = useQueryClient();
    const { updateUser } = useAuth();
    return useMutation<ProfileUser, Error, ProfileUpdate>({
        mutationFn: (data) => profileApi.updateMe(data),
        onSuccess: (updated) => {
            qc.setQueryData(
                profileKeys.me(),
                (old: ProfileUser | undefined) => {
                    if (!old) return old;
                    return { ...old, ...updated };
                },
            );
            updateUser(updated);
            toast.success("Perfil atualizado com sucesso!");
        },
        onError: (error) => {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Erro ao atualizar perfil. Tente novamente.",
                ),
            );
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePassword) => profileApi.changePassword(data),
        onSuccess: () => {
            toast.success("Senha alterada com sucesso!");
        },
        onError: (error) => {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Falha ao alterar senha. Verifique a senha atual e tente novamente.",
                ),
            );
        },
    });
}
