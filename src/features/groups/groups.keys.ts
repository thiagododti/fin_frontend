export const groupKeys = {
    all: () => ["groups"] as const,
    list: (filters?: unknown, page?: number) =>
        [...groupKeys.all(), filters, page] as const,
    detail: (id: string) => [...groupKeys.all(), id] as const,
};
