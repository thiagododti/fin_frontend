import { Navigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { paths } from '@/routes/paths';

import { AppShell } from '@/shared/components/shell/AppShell';

export function PrivateLayout() {
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={paths.login} replace />;
    }

    return <AppShell />;
}
