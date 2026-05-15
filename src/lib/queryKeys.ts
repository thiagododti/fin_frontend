export const queryKeys = {
    users: {
        all: () => ["users"] as const,
        list: (filters?: unknown, page?: number) =>
            [...queryKeys.users.all(), filters, page] as const,
        detail: (id: number) => [...queryKeys.users.all(), id] as const,
    },

    tokens: {
        detail: (userId: number) => ["token", userId] as const,
    },
};
