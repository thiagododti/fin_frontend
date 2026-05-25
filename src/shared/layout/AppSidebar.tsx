import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    LogOut,
    KeyRound,
    UserRound,
    ChevronsUpDown,
    BookOpen,
    Building2,
    ChevronRight,
    Tag,
    Wallet,
    CreditCard,
    UsersRound,
    UserPlus,
    ArrowLeftRight,
    Split,
    Banknote,
    MoveRight,
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { ChangePasswordDialog } from "@/features/profile/components/ChangePasswordDialog";
import { ProfileDialog } from "@/features/profile/components/ProfileDialog";
import { cn } from "@/lib/utils";

const topItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
];

const cadastrosItems = [
    { label: "Bancos", icon: Building2, href: "/cadastros/banks" },
    { label: "Categorias", icon: Tag, href: "/cadastros/categories" },
    { label: "Contas", icon: Wallet, href: "/cadastros/accounts" },
    {
        label: "Cartões de Crédito",
        icon: CreditCard,
        href: "/cadastros/credit-cards",
    },
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
    const [cadastrosOpen, setCadastrosOpen] = useState(
        location.pathname.startsWith("/cadastros"),
    );
    const [gruposFamiliasOpen, setGruposFamiliasOpen] = useState(
        location.pathname.startsWith("/grupos-familias"),
    );
    const [movimentacoesOpen, setMovimentacoesOpen] = useState(
        location.pathname.startsWith("/movimentacoes"),
    );

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

                                {/* Movimentações */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip="Movimentações"
                                        isActive={location.pathname.startsWith(
                                            "/movimentacoes",
                                        )}
                                        onClick={() =>
                                            setMovimentacoesOpen(
                                                (prev) => !prev,
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <ArrowLeftRight />
                                        <span>Movimentações</span>
                                        <ChevronRight
                                            className={cn(
                                                "ml-auto h-4 w-4 transition-transform duration-200",
                                                movimentacoesOpen &&
                                                    "rotate-90",
                                            )}
                                        />
                                    </SidebarMenuButton>
                                    {movimentacoesOpen && (
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname.startsWith(
                                                        "/movimentacoes/transactions",
                                                    )}
                                                >
                                                    <NavLink to="/movimentacoes/transactions">
                                                        <ArrowLeftRight />
                                                        <span>Transações</span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname.startsWith(
                                                        "/movimentacoes/transaction-shares",
                                                    )}
                                                >
                                                    <NavLink to="/movimentacoes/transaction-shares">
                                                        <Split />
                                                        <span>Rateios</span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname.startsWith(
                                                        "/movimentacoes/share-payments",
                                                    )}
                                                >
                                                    <NavLink to="/movimentacoes/share-payments">
                                                        <Banknote />
                                                        <span>Pagamentos</span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname.startsWith(
                                                        "/movimentacoes/transfers",
                                                    )}
                                                >
                                                    <NavLink to="/movimentacoes/transfers">
                                                        <MoveRight />
                                                        <span>
                                                            Transferências
                                                        </span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>

                                {/* Usuários */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip="Usuários"
                                        isActive={location.pathname.startsWith(
                                            "/users",
                                        )}
                                    >
                                        <NavLink to="/users">
                                            <Users />
                                            <span>Usuários</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Cadastros */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip="Cadastros"
                                        isActive={location.pathname.startsWith(
                                            "/cadastros",
                                        )}
                                        onClick={() =>
                                            setCadastrosOpen((prev) => !prev)
                                        }
                                        className="cursor-pointer"
                                    >
                                        <BookOpen />
                                        <span>Cadastros</span>
                                        <ChevronRight
                                            className={cn(
                                                "ml-auto h-4 w-4 transition-transform duration-200",
                                                cadastrosOpen && "rotate-90",
                                            )}
                                        />
                                    </SidebarMenuButton>
                                    {cadastrosOpen && (
                                        <SidebarMenuSub>
                                            {cadastrosItems.map((item) => (
                                                <SidebarMenuSubItem
                                                    key={item.href}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={location.pathname.startsWith(
                                                            item.href,
                                                        )}
                                                    >
                                                        <NavLink to={item.href}>
                                                            <item.icon />
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                        </NavLink>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>

                                {/* Grupos e Famílias */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip="Grupos e Famílias"
                                        isActive={location.pathname.startsWith(
                                            "/grupos-familias",
                                        )}
                                        onClick={() =>
                                            setGruposFamiliasOpen(
                                                (prev) => !prev,
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <UsersRound />
                                        <span>Grupos e Famílias</span>
                                        <ChevronRight
                                            className={cn(
                                                "ml-auto h-4 w-4 transition-transform duration-200",
                                                gruposFamiliasOpen &&
                                                    "rotate-90",
                                            )}
                                        />
                                    </SidebarMenuButton>
                                    {gruposFamiliasOpen && (
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname.startsWith(
                                                        "/grupos-familias/groups",
                                                    )}
                                                >
                                                    <NavLink to="/grupos-familias/groups">
                                                        <UsersRound />
                                                        <span>Grupos</span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname.startsWith(
                                                        "/grupos-familias/group-members",
                                                    )}
                                                >
                                                    <NavLink to="/grupos-familias/group-members">
                                                        <UserPlus />
                                                        <span>Membros</span>
                                                    </NavLink>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
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
                                                {user?.email || user?.username}
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
