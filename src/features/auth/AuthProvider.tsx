import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProfileUser } from "@/shared/types/profileUser";
import { authApi } from "./authService";
import { fetchMe } from "@/shared/services/meService";
import { isTokenExpired, getTokenExpiry } from "@/lib/jwt";
import { tokenStore } from "@/lib/tokenStore";
import { AuthContext } from "./context";

const MAX_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24h — evita overflow em setTimeout

type SessionData = {
    user: ProfileUser;
    refreshToken: string | null;
} | null;

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = useCallback(() => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
        const refreshToken = tokenStore.getRefreshToken();
        tokenStore.clear();
        setUser(null);
        if (refreshToken) {
            authApi.blacklist(refreshToken).catch(() => undefined);
        }
    }, []);

    const scheduleLogout = useCallback(
        (refreshToken: string) => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
                logoutTimerRef.current = null;
            }

            const expiry = getTokenExpiry(refreshToken);
            if (!expiry) return;

            const msUntilLogout = expiry.getTime() - Date.now();
            if (msUntilLogout <= 0) {
                logout();
                return;
            }

            const delay = Math.min(msUntilLogout, MAX_TIMEOUT_MS);
            logoutTimerRef.current = setTimeout(() => {
                if (Date.now() >= expiry.getTime()) {
                    logout();
                } else {
                    scheduleLogout(refreshToken); // reagenda se ainda não expirou
                }
            }, delay);
        },
        [logout],
    );

    const login = async (username: string, password: string) => {
        const tokens = await authApi.login({ username, password });
        tokenStore.setAccessToken(tokens.access);
        tokenStore.setRefreshToken(tokens.refresh);

        const fullUser = await fetchMe();
        if (!fullUser) {
            tokenStore.clear();
            throw new Error("Nao foi possivel carregar o usuario autenticado");
        }

        setUser(fullUser);
        scheduleLogout(tokens.refresh);
    };

    // Escuta eventos emitidos pelo interceptor do axios
    useEffect(() => {
        const handleTokenRefreshed = (e: Event) => {
            const { refresh } = (
                e as CustomEvent<{ access: string; refresh: string }>
            ).detail;
            if (refresh) scheduleLogout(refresh);
        };

        const handleSessionExpired = () => logout();

        window.addEventListener("auth:token-refreshed", handleTokenRefreshed);
        window.addEventListener("auth:session-expired", handleSessionExpired);

        return () => {
            window.removeEventListener(
                "auth:token-refreshed",
                handleTokenRefreshed,
            );
            window.removeEventListener(
                "auth:session-expired",
                handleSessionExpired,
            );
        };
    }, [logout, scheduleLogout]);

    const hasToken = !!(
        tokenStore.getAccessToken() || tokenStore.getRefreshToken()
    );

    const { data: sessionData, isLoading } = useQuery<SessionData>({
        queryKey: ["auth", "session"],
        queryFn: async () => {
            const accessToken = tokenStore.getAccessToken();
            const storedRefreshToken = tokenStore.getRefreshToken();

            let latestRefreshToken: string | null = storedRefreshToken;

            if (accessToken && !isTokenExpired(accessToken)) {
                // Token de acesso válido, apenas buscar usuário
            } else if (
                storedRefreshToken &&
                !isTokenExpired(storedRefreshToken)
            ) {
                try {
                    const tokens = await authApi.refresh(storedRefreshToken);
                    tokenStore.setAccessToken(tokens.access);
                    tokenStore.setRefreshToken(tokens.refresh);
                    latestRefreshToken = tokens.refresh;
                } catch {
                    tokenStore.clear();
                    return null;
                }
            } else {
                tokenStore.clear();
                return null;
            }

            const fullUser = await fetchMe();
            if (!fullUser) {
                tokenStore.clear();
                return null;
            }

            return { user: fullUser, refreshToken: latestRefreshToken };
        },
        enabled: hasToken,
        retry: false,
        staleTime: Infinity,
    });

    // Reage ao resultado da inicialização da sessão (não é data fetching)
    useEffect(() => {
        if (isLoading) return;
        if (sessionData) {
            setUser(sessionData.user);
            if (sessionData.refreshToken)
                scheduleLogout(sessionData.refreshToken);
        }
    }, [sessionData, isLoading, scheduleLogout]);

    // Limpa o timer ao desmontar o componente
    useEffect(() => {
        return () => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, []);

    const updateUser = useCallback((updated: ProfileUser) => {
        setUser(updated);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
