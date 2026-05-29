import { getMe } from '@/features/auth/api/MeService';
import { AUTH_BROADCAST_CHANNEL } from '@/features/auth/constants/auth-keys';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { clearTokens, getAccessToken } from '@/features/auth/storage/auth-storage';
import type { Me } from '@/features/auth/types/Me';
import { logoutService } from '@/shared/services/logout-service';
import type { ChildrenProps } from '@/shared/types/ChildrenProps';
import { useCallback, useEffect, useMemo, useState } from 'react';

function isAuthError(error: unknown): boolean {
    if (typeof error === 'object' && error !== null && 'status' in error) {
        const status = (error as { status: number }).status;
        return status === 401 || status === 403;
    }
    return false;
}

export function AuthProvider({ children }: ChildrenProps) {
    // O estado do usuário e o status de bootstrapping são gerenciados localmente no provedor de autenticação.
    const [user, setUser] = useState<Me | null>(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    // Na inicialização, tenta carregar o usuário atual usando o token armazenado.
    useEffect(() => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            setIsBootstrapping(false);
            return;
        }

        getMe()
            .then(setUser)
            .catch((error) => {
                if (isAuthError(error)) {
                    clearTokens();
                }
            })
            .finally(() => setIsBootstrapping(false));
    }, []);

    // Escuta eventos de logout para limpar o estado do usuário
    useEffect(() => {
        const handleLogout = () => setUser(null);
        const authChannel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);

        window.addEventListener('auth:logout', handleLogout);
        authChannel.addEventListener('message', handleLogout);

        return () => {
            window.removeEventListener('auth:logout', handleLogout);
            authChannel.removeEventListener('message', handleLogout);
            authChannel.close();
        };
    }, []);

    // Funções de login e logout são memoizadas para evitar re-renderizações desnecessárias dos consumidores do contexto.
    const signIn = useCallback((me: Me) => setUser(me), []);
    const signOut = useCallback(() => logoutService(), []);

    // O valor do contexto é memoizado para evitar re-renderizações desnecessárias dos consumidores.
    const value = useMemo(() => {
        return {
            user,
            isAuthenticated: !!user,
            isBootstrapping,
            signIn,
            signOut,
            hasPermission: (_permission: string) => false,
        };
    }, [user, isBootstrapping, signIn, signOut]);

    // O provedor de autenticação envolve os componentes filhos e fornece o contexto de autenticação para toda a aplicação.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
