import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { PageLoader } from "@/shared/components/PageLoader";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { ROUTES } from "./routes";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const DashboardPage = lazy(
    () => import("@/features/dashboard/pages/DashboardPage"),
);
const UsersPage = lazy(() => import("@/features/users/pages/UsersPage"));
const NotFoundPage = lazy(() => import("@/shared/pages/NotFoundPage"));

function withSuspense(element: React.ReactNode) {
    return (
        <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>{element}</Suspense>
        </ErrorBoundary>
    );
}

export const router = createBrowserRouter([
    {
        path: ROUTES.login,
        element: withSuspense(<LoginPage />),
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: ROUTES.dashboard,
                        element: withSuspense(<DashboardPage />),
                    },
                    {
                        path: ROUTES.users,
                        element: withSuspense(<UsersPage />),
                    },
                ],
            },
        ],
    },
    {
        path: ROUTES.home,
        element: <Navigate to={ROUTES.dashboard} replace />,
    },
    {
        path: "*",
        element: withSuspense(<NotFoundPage />),
    },
]);
