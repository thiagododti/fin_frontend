import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { RootErrorPage } from "@/shared/pages/RootErrorPage";

type ProvidersProps = {
    children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary FallbackComponent={RootErrorPage}>
            <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                        <Toaster />
                        <AuthProvider>{children}</AuthProvider>
                    </TooltipProvider>
                    {import.meta.env.DEV && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </QueryClientProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
