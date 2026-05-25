export const accountKeys = {
    all: () => ["accounts"] as const,
    list: (filters?: unknown, page?: number) =>
        [...accountKeys.all(), filters, page] as const,
    detail: (id: number) => [...accountKeys.all(), id] as const,
};
