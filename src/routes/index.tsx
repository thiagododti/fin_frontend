import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

const Login = lazy(() => import("@/features/auth/pages/Login"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const UsersPage = lazy(() => import("@/features/users/pages/Users"));
const BanksPage = lazy(() => import("@/features/banks/pages/Banks"));
const CategoriesPage = lazy(
    () => import("@/features/categories/pages/Categories"),
);
const AccountsPage = lazy(() => import("@/features/accounts/pages/Accounts"));
const CreditCardsPage = lazy(
    () => import("@/features/credit-cards/pages/CreditCards"),
);
const GroupsPage = lazy(() => import("@/features/groups/pages/Groups"));
const GroupMembersPage = lazy(
    () => import("@/features/group-members/pages/GroupMembers"),
);
const TransactionsPage = lazy(
    () => import("@/features/transactions/pages/Transactions"),
);
const TransactionSharesPage = lazy(
    () => import("@/features/transaction-shares/pages/TransactionShares"),
);
const SharePaymentsPage = lazy(
    () => import("@/features/share-payments/pages/SharePayments"),
);
const TransfersPage = lazy(
    () => import("@/features/transfers/pages/Transfers"),
);

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
                            <Route
                                path="/cadastros/banks"
                                element={<BanksPage />}
                            />
                            <Route
                                path="/cadastros/categories"
                                element={<CategoriesPage />}
                            />
                            <Route
                                path="/cadastros/accounts"
                                element={<AccountsPage />}
                            />
                            <Route
                                path="/cadastros/credit-cards"
                                element={<CreditCardsPage />}
                            />
                            <Route
                                path="/grupos-familias/groups"
                                element={<GroupsPage />}
                            />
                            <Route
                                path="/grupos-familias/group-members"
                                element={<GroupMembersPage />}
                            />
                            <Route
                                path="/movimentacoes/transactions"
                                element={<TransactionsPage />}
                            />
                            <Route
                                path="/movimentacoes/transaction-shares"
                                element={<TransactionSharesPage />}
                            />
                            <Route
                                path="/movimentacoes/share-payments"
                                element={<SharePaymentsPage />}
                            />
                            <Route
                                path="/movimentacoes/transfers"
                                element={<TransfersPage />}
                            />
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
