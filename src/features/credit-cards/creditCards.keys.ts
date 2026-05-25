export const creditCardKeys = {
    all: () => ["credit-cards"] as const,
    list: (filters?: unknown, page?: number) =>
        [...creditCardKeys.all(), filters, page] as const,
    detail: (id: number) => [...creditCardKeys.all(), id] as const,
};
