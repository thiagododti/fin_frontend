import { Loader2, MoveRight } from "lucide-react";
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
import { format, parseISO } from "date-fns";
import type { Transfer } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface TransferTableProps {
    data: PaginatedResponse<Transfer> | undefined;
    isLoading: boolean;
    onEdit: (transfer: Transfer) => void;
    onDelete: (transfer: Transfer) => void;
}

function formatDate(value: string) {
    try {
        return format(parseISO(value), "dd/MM/yyyy");
    } catch {
        return value;
    }
}

export function TransferTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: TransferTableProps) {
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
                            Descrição
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Origem → Destino
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Valor
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Data
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
                                Nenhuma transferência encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((transfer) => (
                        <TableRow key={transfer.id} className="border-border">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center shrink-0">
                                        <MoveRight className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
                                        {transfer.description}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-sm text-foreground">
                                    <span className="font-mono">
                                        #{transfer.source_account}
                                    </span>
                                    <MoveRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="font-mono">
                                        #{transfer.destination_account}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-mono font-medium text-primary">
                                    {Number(transfer.amount).toLocaleString(
                                        "pt-BR",
                                        {
                                            style: "currency",
                                            currency: "BRL",
                                        },
                                    )}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    {formatDate(transfer.transfer_date)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit(transfer)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => onDelete(transfer)}
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
