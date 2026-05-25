export const groupMemberKeys = {
    all: () => ["group-members"] as const,
    list: (filters?: unknown, page?: number) =>
        [...groupMemberKeys.all(), filters, page] as const,
    detail: (id: string) => [...groupMemberKeys.all(), id] as const,
};
