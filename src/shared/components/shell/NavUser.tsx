import { LogOut, User, Settings, ChevronsUpDown } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { useAuth } from '@/features/auth/hooks/useAuth';

export function NavUser() {
    const { user, signOut } = useAuth();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="w-full">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                {user?.first_name?.[0] ?? 'U'}
                            </div>

                            <div className="flex flex-1 flex-col text-left">
                                <span className="truncate text-sm font-medium">
                                    {user?.first_name} {user?.last_name}
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    {user?.email}
                                </span>
                            </div>

                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="top" align="end" className="w-56">
                        <DropdownMenuItem>
                            <User />
                            Perfil
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Settings />
                            Configurações
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={signOut}>
                            <LogOut />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
