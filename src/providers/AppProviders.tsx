import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import type { Props } from '@/shared/types/Children';

export function AppProviders({ children }: Props) {
    return (
        <QueryProvider>
            <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </QueryProvider>
    );
}
