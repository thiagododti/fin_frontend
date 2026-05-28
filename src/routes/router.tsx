import { createBrowserRouter } from 'react-router-dom';

import { PublicLayout } from '@/layouts/PublicLayout';
import { PrivateLayout } from '@/layouts/PrivateLayout';

import { paths } from '@/routes/paths';
import { Login } from '@/features/auth/pages/LoginPage';
import { Home } from '@/features/home/pages/HomePage';
import { Forbidden } from '@/shared/pages/ForbiddenPage';
import { NotFound } from '@/shared/pages/NotFoundPage';

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: paths.login,
                element: <Login />,
            },
        ],
    },
    {
        element: <PrivateLayout />,
        children: [
            {
                path: paths.home,
                element: <Home />,
            },
        ],
    },
    {
        path: paths.notfound,
        element: <NotFound />,
    },
    {
        path: paths.forbidden,
        element: <Forbidden />,
    },
]);
