import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "../groupsService";
import { groupKeys } from "../groups.keys";
import type { GroupFilters, GroupCreate, GroupUpdate } from "../types";

export function useGroups(filters?: GroupFilters, page = 1) {
    return useQuery({
        queryKey: groupKeys.list(filters, page),
        queryFn: () => groupsApi.list({ ...filters, page }),
    });
}

export function useGroup(id: string) {
    return useQuery({
        queryKey: groupKeys.detail(id),
        queryFn: () => groupsApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateGroup() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: GroupCreate) => groupsApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.all() }),
    });
}

export function useUpdateGroup() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: GroupUpdate }) =>
            groupsApi.patch(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.all() }),
    });
}

export function useDeleteGroup() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => groupsApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.all() }),
    });
}
