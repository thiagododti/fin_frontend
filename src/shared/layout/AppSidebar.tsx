import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const topItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Usuários", icon: Users, href: "/users" },
];

export function AppSidebar() {
    const location = useLocation();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex h-8 items-center gap-2 px-2">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-6 w-6 object-contain shrink-0"
                    />
                    <span className="text-sm font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
                        WalletFy
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {topItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        isActive={location.pathname.startsWith(
                                            item.href,
                                        )}
                                    >
                                        <NavLink to={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
