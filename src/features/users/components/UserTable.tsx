import { Pencil, Loader2, ShieldCheck, Crown } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
    AvatarBadge,
} from "@/components/ui/avatar";
import { cn, formatDate, getInitials } from "@/lib/utils";
import type { User } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

type UserTableProps = {
    data: PaginatedResponse<User> | undefined;
    isLoading: boolean;
    onEdit: (user: User) => void;
};

export function UserTable({ data, isLoading, onEdit }: UserTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border bg-card shadow-surface-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">
                            Usuário
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            E-mail
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Nascimento
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Membro desde
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Permissões
                        </TableHead>
                        <TableHead className="text-muted-foreground w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.map((user) => (
                        <TableRow key={user.id} className="border-border">
                            {/* Avatar + nome + username */}
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={user.photo ?? undefined}
                                            />
                                            <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
                                                {getInitials(
                                                    user.first_name,
                                                    user.last_name,
                                                    user.username,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <AvatarBadge
                                            className={cn(
                                                user.is_active
                                                    ? "bg-green-500"
                                                    : "bg-red-500",
                                            )}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {user.first_name || user.last_name
                                                ? `${user.first_name} ${user.last_name}`.trim()
                                                : user.username}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            {/* E-mail */}
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    {user.email || (
                                        <span className="text-muted-foreground">
                                            —
                                        </span>
                                    )}
                                </span>
                            </TableCell>

                            {/* Nascimento */}
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    {formatDate(user.birth_date)}
                                </span>
                            </TableCell>

                            {/* Membro desde */}
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    {formatDate(user.date_joined)}
                                </span>
                            </TableCell>

                            {/* Permissões */}
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    {user.is_superuser && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 bg-warning/15 text-warning border-transparent hover:bg-warning/20"
                                        >
                                            <Crown className="h-3 w-3" />
                                            Super
                                        </Badge>
                                    )}
                                    {user.is_staff && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 bg-primary/15 text-primary border-transparent hover:bg-primary/20"
                                        >
                                            <ShieldCheck className="h-3 w-3" />
                                            Staff
                                        </Badge>
                                    )}
                                    {!user.is_superuser && !user.is_staff && (
                                        <span className="text-xs text-muted-foreground">
                                            —
                                        </span>
                                    )}
                                </div>
                            </TableCell>

                            {/* Ações */}
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(user)}
                                    >
                                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center text-muted-foreground py-8"
                            >
                                Nenhum usuário encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
