import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const PageLoader = () => (
    <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);

export function AppLayout() {
    return (
        <SidebarProvider className="h-screen overflow-hidden">
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <AppHeader />
                <div className="flex-1 overflow-auto p-6">
                    <ErrorBoundary>
                        <Suspense fallback={<PageLoader />}>
                            <Outlet />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
