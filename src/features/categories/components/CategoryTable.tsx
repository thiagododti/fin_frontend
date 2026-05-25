import { Loader2 } from "lucide-react";
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
import type { Category } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface CategoryTableProps {
    data: PaginatedResponse<Category> | undefined;
    isLoading: boolean;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export function CategoryTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: CategoryTableProps) {
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
                            Nome
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Tipo
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Ícone
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Cadastrado em
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
                                Nenhuma categoria encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((category) => (
                        <TableRow key={category.id} className="border-border">
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {category.color && (
                                        <span
                                            className="inline-block h-3 w-3 rounded-full shrink-0"
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                        />
                                    )}
                                    <span className="text-sm font-medium text-foreground">
                                        {category.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        category.type === "income"
                                            ? "border-transparent bg-success/15 text-success"
                                            : "border-transparent bg-destructive/15 text-destructive"
                                    }
                                >
                                    {category.type === "income"
                                        ? "Receita"
                                        : "Despesa"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground font-mono">
                                    {category.icon || "—"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(category.created_at)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        onClick={() => onEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => onDelete(category)}
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
