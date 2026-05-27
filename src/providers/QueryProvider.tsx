import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/react-query/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { React } from '@/shared/types/React';

// Estilos globais para o React Query Devtools

export function QueryProvider({ children }: React) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
