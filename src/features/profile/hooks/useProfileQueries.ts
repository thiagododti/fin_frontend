import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api";
import { profileKeys } from "../profile.keys";
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
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePassword) => profileApi.changePassword(data),
    });
}
