import type { ProfileUser } from "@/shared/types/profileUser";
export type {
    TokenResponse,
    RefreshResponse,
} from "@/features/auth/schemas/tokenSchema";

export type LoginCredentials = {
    username: string;
    password: string;
};

export type AuthContextType = {
    user: ProfileUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: ProfileUser) => void;
};
