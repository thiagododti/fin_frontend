import type { ProfileUser } from "@/features/profile/types";
export type { TokenResponse, RefreshResponse } from "./schemas/tokenSchema";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthContextType {
    user: ProfileUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: ProfileUser) => void;
}
