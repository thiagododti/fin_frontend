export const sharePaymentKeys = {
    all: () => ["share-payments"] as const,
    list: (filters?: unknown, page?: number) =>
        [...sharePaymentKeys.all(), filters, page] as const,
    detail: (id: number) => [...sharePaymentKeys.all(), id] as const,
};
