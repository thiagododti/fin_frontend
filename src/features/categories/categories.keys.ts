export const categoryKeys = {
    all: () => ["categories"] as const,
    list: (filters?: unknown, page?: number) =>
        [...categoryKeys.all(), filters, page] as const,
    detail: (id: number) => [...categoryKeys.all(), id] as const,
};
