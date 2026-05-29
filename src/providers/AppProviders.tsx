import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import type { ChildrenProps } from '@/shared/types/ChildrenProps';

export function AppProviders({ children }: ChildrenProps) {
    return (
        <QueryProvider>
            <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </QueryProvider>
    );
}
