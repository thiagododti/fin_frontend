import { Outlet } from 'react-router-dom';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/shared/components/shell/AppSidebar';
import { AppHeader } from '@/shared/components/shell/AppHeader';

export function AppShell() {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <AppHeader />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
