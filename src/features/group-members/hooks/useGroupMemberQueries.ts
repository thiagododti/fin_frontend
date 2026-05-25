import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupMembersApi } from "../groupMembersService";
import { groupMemberKeys } from "../groupMembers.keys";
import type {
    GroupMemberFilters,
    GroupMemberCreate,
    GroupMemberUpdate,
} from "../types";

export function useGroupMembers(filters?: GroupMemberFilters, page = 1) {
    return useQuery({
        queryKey: groupMemberKeys.list(filters, page),
        queryFn: () => groupMembersApi.list({ ...filters, page }),
    });
}

export function useGroupMember(id: string) {
    return useQuery({
        queryKey: groupMemberKeys.detail(id),
        queryFn: () => groupMembersApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateGroupMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: GroupMemberCreate) => groupMembersApi.create(data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: groupMemberKeys.all() }),
    });
}

export function useUpdateGroupMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: GroupMemberUpdate }) =>
            groupMembersApi.patch(id, data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: groupMemberKeys.all() }),
    });
}

export function useDeleteGroupMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => groupMembersApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: groupMemberKeys.all() }),
    });
}
