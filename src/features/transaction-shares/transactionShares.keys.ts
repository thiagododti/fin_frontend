export const transactionShareKeys = {
    all: () => ["transaction-shares"] as const,
    list: (filters?: unknown, page?: number) =>
        [...transactionShareKeys.all(), filters, page] as const,
    detail: (id: number) => [...transactionShareKeys.all(), id] as const,
};
