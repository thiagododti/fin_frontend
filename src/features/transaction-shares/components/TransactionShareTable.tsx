import { Loader2, Split } from "lucide-react";
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
import type { TransactionShare } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface TransactionShareTableProps {
    data: PaginatedResponse<TransactionShare> | undefined;
    isLoading: boolean;
    onEdit: (share: TransactionShare) => void;
    onDelete: (share: TransactionShare) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
        label: "Pendente",
        className: "bg-warning/15 text-warning border-transparent",
    },
    partially_paid: {
        label: "Parcialmente pago",
        className: "bg-primary/15 text-primary border-transparent",
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

export function TransactionShareTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: TransactionShareTableProps) {
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
                            ID
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Transação
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Membro
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Valor
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
                                Nenhum rateio encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((share) => {
                        const status =
                            statusConfig[share.status] ?? statusConfig.pending;
                        return (
                            <TableRow key={share.id} className="border-border">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center shrink-0">
                                            <Split className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-mono text-foreground">
                                            #{share.id}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-foreground">
                                        #{share.transaction}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className="text-sm font-mono text-muted-foreground"
                                        title={share.group_member}
                                    >
                                        {share.group_member.slice(0, 8)}…
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-mono font-medium text-foreground">
                                        {Number(share.amount).toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                            },
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
                                            onClick={() => onEdit(share)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => onDelete(share)}
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
