import type { Me } from '@/features/auth/types/Me';

export type AuthContextType = {
    user: Me | null;
    isAuthenticated: boolean;
    setUser: (user: Me | null) => void;
};
