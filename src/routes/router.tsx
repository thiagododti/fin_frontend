import { createBrowserRouter } from 'react-router-dom';

import { PublicLayout } from '@/layouts/PublicLayout';
import { PrivateLayout } from '@/layouts/PrivateLayout';

import { paths } from '@/routes/paths';
import { Login } from '@/features/auth/pages/LoginPage';
import { Home } from '@/features/home/pages/HomePage';

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
]);
