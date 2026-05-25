export const transactionKeys = {
    all: () => ["transactions"] as const,
    list: (filters?: unknown, page?: number) =>
        [...transactionKeys.all(), filters, page] as const,
    detail: (id: number) => [...transactionKeys.all(), id] as const,
};
