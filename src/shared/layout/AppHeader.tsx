import { useState } from "react";
import { useAuth } from "@/features/auth/hooks";
import {
    LogOut,
    KeyRound,
    ChevronDown,
    UserRound,
    Sun,
    Moon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/features/users/components/ChangePasswordDialog";
import { ProfileDialog } from "@/features/users/components/ProfileDialog";
import { useTheme } from "@/providers/ThemeProvider";

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

export function AppHeader() {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name}`.trim()
        : user?.username || "User";

    return (
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    WalletFy - Seu sistema de gestão financeira pessoal
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="Alternar tema"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-secondary/60 transition-colors outline-none">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photo ?? undefined} />
                                <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
                                    {user
                                        ? getInitials(
                                              user.first_name,
                                              user.last_name,
                                              user.username,
                                          )
                                        : "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight text-left">
                                <span className="text-sm font-medium text-foreground">
                                    {displayName}
                                </span>
                                {(user?.is_superuser || user?.is_staff) && (
                                    <span className="text-xs text-muted-foreground">
                                        {user.is_superuser
                                            ? "Superusuário"
                                            : "Staff"}
                                    </span>
                                )}
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-52 bg-card border-border"
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                            {user?.email || user?.username}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onSelect={() => setProfileOpen(true)}
                        >
                            <UserRound className="h-4 w-4 text-muted-foreground" />
                            Editar Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onSelect={() => setChangePasswordOpen(true)}
                        >
                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                            Alterar Senha
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onSelect={logout}
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ChangePasswordDialog
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
            />
            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
        </header>
    );
}
