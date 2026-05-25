import { Loader2, UserPlus } from "lucide-react";
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
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { GroupMember } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface GroupMemberTableProps {
    data: PaginatedResponse<GroupMember> | undefined;
    isLoading: boolean;
    onEdit: (member: GroupMember) => void;
    onDelete: (member: GroupMember) => void;
}

const roleConfig: Record<string, { label: string; className: string }> = {
    owner: {
        label: "Dono",
        className: "bg-primary/15 text-primary border-transparent",
    },
    admin: {
        label: "Admin",
        className: "bg-warning/15 text-warning border-transparent",
    },
    member: {
        label: "Membro",
        className: "bg-muted text-muted-foreground border-transparent",
    },
};

export function GroupMemberTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: GroupMemberTableProps) {
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
                            Grupo
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Papel
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Adicionado em
                        </TableHead>
                        <TableHead className="text-muted-foreground w-20"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-10 text-center text-sm text-muted-foreground"
                            >
                                Nenhum membro encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((member) => {
                        const role = roleConfig[member.role] ?? {
                            label: member.role,
                            className:
                                "bg-muted text-muted-foreground border-transparent",
                        };
                        return (
                            <TableRow key={member.id} className="border-border">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm font-mono text-foreground">
                                            #{member.user}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-mono text-muted-foreground">
                                        {member.group.slice(0, 8)}…
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={role.className}>
                                        {role.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-foreground">
                                        {formatDate(member.created_at)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => onEdit(member)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => onDelete(member)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
