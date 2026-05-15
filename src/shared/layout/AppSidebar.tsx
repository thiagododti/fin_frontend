import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    LogOut,
    KeyRound,
    UserRound,
    ChevronsUpDown,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { ChangePasswordDialog } from "@/features/profile/components/ChangePasswordDialog";
import { ProfileDialog } from "@/features/profile/components/ProfileDialog";

const topItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Usuários", icon: Users, href: "/users" },
];

function getInitials(
    firstName: string,
    lastName: string,
    username: string,
): string {
    if (firstName || lastName) {
        return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
}

export function AppSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name}`.trim()
        : user?.username || "User";

    return (
        <>
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

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        tooltip={displayName}
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={user?.photo ?? undefined}
                                            />
                                            <AvatarFallback className="rounded-lg text-xs font-medium">
                                                {user
                                                    ? getInitials(
                                                          user.first_name,
                                                          user.last_name,
                                                          user.username,
                                                      )
                                                    : "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {displayName}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {user?.is_superuser
                                                    ? "Superusuário"
                                                    : user?.is_staff
                                                      ? "Staff"
                                                      : user?.email}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="top"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                        {user?.email || user?.username}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="gap-2 cursor-pointer"
                                        onSelect={() => setProfileOpen(true)}
                                    >
                                        <UserRound className="h-4 w-4 text-muted-foreground" />
                                        Editar Perfil
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="gap-2 cursor-pointer"
                                        onSelect={() =>
                                            setChangePasswordOpen(true)
                                        }
                                    >
                                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                                        Alterar Senha
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                        onSelect={logout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sair
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            <ChangePasswordDialog
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
            />
            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
        </>
    );
}
