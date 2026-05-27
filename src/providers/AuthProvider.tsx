import { AuthContext } from '@/features/auth/context/AuthContext';
import type { Me } from '@/features/auth/types/Me';
import type { React } from '@/shared/types/React';
import { useMemo, useState } from 'react';

export function AuthProvider({ children }: React) {
    const [user, setUser] = useState<Me | null>(null);

    const value = useMemo(() => {
        return {
            user,
            isAuthenticated: !!user,
            setUser,
        };
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
