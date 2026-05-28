import { Navigate, Outlet } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function PrivateLayout() {
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) return <div>Loading...</div>;
    if (!isAuthenticated) {
        return <Navigate to={paths.login} replace />
    };

    return (
        <main>
            <Outlet />
        </main>
    );
}
