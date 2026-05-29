import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { NavMain } from '@/shared/components/shell/NavMain';
import { NavUser } from '@/shared/components/shell/NavUser';

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="px-2 py-2 text-lg font-bold">Fin Frontend</div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
