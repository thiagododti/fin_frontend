export const transferKeys = {
    all: () => ["transfers"] as const,
    list: (filters?: unknown, page?: number) =>
        [...transferKeys.all(), filters, page] as const,
    detail: (id: number) => [...transferKeys.all(), id] as const,
};
