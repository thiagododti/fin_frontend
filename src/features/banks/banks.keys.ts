export const bankKeys = {
    all: () => ["banks"] as const,
    list: (filters?: unknown, page?: number) =>
        [...bankKeys.all(), filters, page] as const,
    detail: (id: number) => [...bankKeys.all(), id] as const,
};
