import { Loader2, Users } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Group } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface GroupTableProps {
    data: PaginatedResponse<Group> | undefined;
    isLoading: boolean;
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
}

export function GroupTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: GroupTableProps) {
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
                            Grupo
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Criado em
                        </TableHead>
                        <TableHead className="text-muted-foreground w-20"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="py-10 text-center text-sm text-muted-foreground"
                            >
                                Nenhum grupo encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((group) => (
                        <TableRow key={group.id} className="border-border">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {group.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    {formatDate(group.created_at)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit(group)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => onDelete(group)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
