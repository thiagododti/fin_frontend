import { useAuth } from '@/features/auth/hooks/useAuth';
import { paths } from '@/routes/paths';
import { Navigate, Outlet } from 'react-router-dom';

export function PublicLayout() {
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) return <div>Loading...</div>;
    if (isAuthenticated) return <Navigate to={paths.home} replace />;

    return (
        <main>
            <Outlet />
        </main>
    );
}
