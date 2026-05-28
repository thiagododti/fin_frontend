import { getMe, updateMe } from '@/features/auth/api/MeService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMeQuery(enabled = true) {
    return useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        enabled,
        retry: false,
    });
}

export function useUpdateMeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMe,

        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['me'], updatedUser);
        },
    });
}