import { Loader2, Building2, ExternalLink } from "lucide-react";
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
import type { Bank } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface BankTableProps {
    data: PaginatedResponse<Bank> | undefined;
    isLoading: boolean;
    onEdit: (bank: Bank) => void;
    onDelete: (bank: Bank) => void;
}

export function BankTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: BankTableProps) {
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
                            Banco
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Código
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Logo
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
                                Nenhum banco encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((bank) => (
                        <TableRow key={bank.id} className="border-border">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {bank.logo_url ? (
                                        <img
                                            src={bank.logo_url}
                                            alt={bank.name}
                                            className="h-8 w-8 rounded object-contain bg-secondary"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-foreground">
                                        {bank.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-mono text-foreground">
                                    {bank.code}
                                </span>
                            </TableCell>
                            <TableCell>
                                {bank.logo_url ? (
                                    <a
                                        href={bank.logo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                                    >
                                        Ver logo
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        —
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    {formatDate(bank.created_at)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit(bank)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => onDelete(bank)}
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
