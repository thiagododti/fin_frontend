import type { Me } from '@/features/auth/types/Me';

export type AuthContextType = {
    user: Me | null;
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    signIn: (user: Me) => void;
    signOut: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
};
