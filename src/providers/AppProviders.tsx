import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import type { React } from '@/shared/types/React';

export function AppProviders({ children }: React) {
    return (
        <QueryProvider>
            <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </QueryProvider>
    );
}
