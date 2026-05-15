export const userKeys = {
    all: () => ["users"] as const,
    list: (filters?: unknown, page?: number) =>
        [...userKeys.all(), filters, page] as const,
    detail: (id: number) => [...userKeys.all(), id] as const,
};
