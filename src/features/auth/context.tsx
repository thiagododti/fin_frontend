import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import type { AuthContextType } from "./types";
import { authApi } from "./authService";
import { profileApi } from "@/features/profile/api";
import type { ProfileUser } from "@/features/profile/types";
import { isTokenExpired, getTokenExpiry } from "@/lib/jwt";
import { tokenStore } from "@/lib/tokenStore";

const MAX_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24h — evita overflow em setTimeout

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

async function fetchCurrentUser(): Promise<ProfileUser | null> {
    try {
        return await profileApi.me();
    } catch {
        return null;
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

        const fullUser = await fetchCurrentUser();
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

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = tokenStore.getAccessToken();
            const storedRefreshToken = tokenStore.getRefreshToken();

            let validToken: string | null = null;
            let latestRefreshToken: string | null = storedRefreshToken;

            if (accessToken && !isTokenExpired(accessToken)) {
                validToken = accessToken;
            } else if (
                storedRefreshToken &&
                !isTokenExpired(storedRefreshToken)
            ) {
                try {
                    const tokens = await authApi.refresh(storedRefreshToken);
                    tokenStore.setAccessToken(tokens.access);
                    tokenStore.setRefreshToken(tokens.refresh);
                    validToken = tokens.access;
                    latestRefreshToken = tokens.refresh;
                } catch {
                    tokenStore.clear();
                    latestRefreshToken = null;
                }
            } else {
                tokenStore.clear();
                latestRefreshToken = null;
            }

            if (validToken) {
                const fullUser = await fetchCurrentUser();
                if (fullUser) {
                    setUser(fullUser);
                    if (latestRefreshToken) scheduleLogout(latestRefreshToken);
                } else {
                    tokenStore.clear();
                }
            }

            setIsLoading(false);
        };

        initAuth();

        return () => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, [scheduleLogout]);

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
};
