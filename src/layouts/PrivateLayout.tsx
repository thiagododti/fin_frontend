import { Navigate, Outlet } from 'react-router-dom';
import { paths } from '@/routes/paths';

export function PrivateLayout() {
    const isAuthenticated = false; // Aqui vai mudar para useAuth()

    if (!isAuthenticated) {
        return <Navigate to={paths.login} replace />;
    }

    return (
        <main>
            <Outlet />
        </main>
    );
}
