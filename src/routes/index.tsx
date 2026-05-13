import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

const Login = lazy(() => import("@/pages/Login"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const UsersPage = lazy(() => import("@/pages/Users"));

const FullPageLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);

export function AppRoutes() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<FullPageLoader />}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />
                            <Route path="/users" element={<UsersPage />} />
                        </Route>
                    </Route>
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}
