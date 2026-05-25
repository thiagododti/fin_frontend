import {
    Loader2,
    ArrowLeftRight,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { Transaction } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface TransactionTableProps {
    data: PaginatedResponse<Transaction> | undefined;
    isLoading: boolean;
    onEdit: (tx: Transaction) => void;
    onDelete: (tx: Transaction) => void;
}

const typeConfig = {
    income: {
        label: "Receita",
        icon: TrendingUp,
        className: "bg-success/15 text-success border-transparent",
    },
    expense: {
        label: "Despesa",
        icon: TrendingDown,
        className: "bg-destructive/15 text-destructive border-transparent",
    },
    transfer: {
        label: "Transferência",
        icon: ArrowLeftRight,
        className: "bg-primary/15 text-primary border-transparent",
    },
};

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
        label: "Pendente",
        className: "bg-warning/15 text-warning border-transparent",
    },
    paid: {
        label: "Pago",
        className: "bg-success/15 text-success border-transparent",
    },
    cancelled: {
        label: "Cancelado",
        className: "bg-muted text-muted-foreground border-transparent",
    },
};

function formatTransactionDate(value: string) {
    try {
        return format(parseISO(value), "dd/MM/yyyy");
    } catch {
        return value;
    }
}

export function TransactionTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: TransactionTableProps) {
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
                            Tipo
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Valor
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Data
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Status
                        </TableHead>
                        <TableHead className="text-muted-foreground w-20"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.results.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="py-10 text-center text-sm text-muted-foreground"
                            >
                                Nenhuma transação encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((tx) => {
                        const type = typeConfig[tx.type] ?? typeConfig.expense;
                        const status =
                            statusConfig[tx.status] ?? statusConfig.pending;
                        const TypeIcon = type.icon;
                        return (
                            <TableRow key={tx.id} className="border-border">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center shrink-0">
                                            <TypeIcon
                                                className={cn(
                                                    "h-4 w-4",
                                                    type.className.includes(
                                                        "success",
                                                    )
                                                        ? "text-success"
                                                        : type.className.includes(
                                                                "destructive",
                                                            )
                                                          ? "text-destructive"
                                                          : "text-primary",
                                                )}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                                                {tx.description}
                                            </p>
                                            {tx.notes && (
                                                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                                    {tx.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={type.className}>
                                        {type.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={cn(
                                            "text-sm font-mono font-medium",
                                            tx.type === "income"
                                                ? "text-success"
                                                : tx.type === "expense"
                                                  ? "text-destructive"
                                                  : "text-foreground",
                                        )}
                                    >
                                        {tx.type === "expense"
                                            ? "- "
                                            : tx.type === "income"
                                              ? "+ "
                                              : ""}
                                        {Number(tx.amount).toLocaleString(
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
                                        {formatTransactionDate(
                                            tx.transaction_date,
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={status.className}>
                                        {status.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => onEdit(tx)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => onDelete(tx)}
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
