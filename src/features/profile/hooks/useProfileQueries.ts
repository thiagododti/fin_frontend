import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api";
import { profileKeys } from "../profile.keys";
import type { User } from "@/features/users/types";
import type { ProfileUpdate, ProfileUser, ChangePassword } from "../types";

export function useMe() {
    return useQuery<User>({
        queryKey: profileKeys.me(),
        queryFn: () => profileApi.me().then((res) => res.data),
    });
}

export function useUpdateMe() {
    const qc = useQueryClient();
    return useMutation<ProfileUser, Error, ProfileUpdate>({
        mutationFn: (data) => profileApi.updateMe(data).then((res) => res.data),
        onSuccess: (updated) => {
            qc.setQueryData(profileKeys.me(), (old: User | undefined) => {
                if (!old) return old;
                return { ...old, ...updated };
            });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePassword) => profileApi.changePassword(data),
    });
}
