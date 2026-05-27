import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // Tenta novamente uma vez em caso de falha

            staleTime: 5 * 60 * 1000, // 5 minutos - tempo em que os dados são considerados frescos

            gcTime: 10 * 60 * 1000, // 10 minutos - tempo para limpar os dados em cache que não estão mais sendo usados

            refetchOnWindowFocus: false, // Não refaz a consulta ao focar a janela

            refetchOnReconnect: true, // Refaz a consulta ao reconectar

            refetchOnMount: true, // Refaz a consulta ao montar o componente
        },
        mutations: {
            retry: 0, // Não tenta novamente em caso de falha
        },
    },
});
