import { Loader2, Banknote } from "lucide-react";
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
import type { SharePayment } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface SharePaymentTableProps {
    data: PaginatedResponse<SharePayment> | undefined;
    isLoading: boolean;
    onEdit: (payment: SharePayment) => void;
    onDelete: (payment: SharePayment) => void;
}

function formatDate(value: string) {
    try {
        return format(parseISO(value), "dd/MM/yyyy");
    } catch {
        return value;
    }
}

export function SharePaymentTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: SharePaymentTableProps) {
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
                            Rateio
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Valor
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Data
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Observações
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
                                Nenhum pagamento encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((payment) => (
                        <TableRow key={payment.id} className="border-border">
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center shrink-0">
                                        <Banknote className="h-4 w-4 text-success" />
                                    </div>
                                    <span className="text-sm font-mono text-foreground">
                                        #{payment.id}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    #{payment.transaction_share}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-mono font-medium text-success">
                                    {Number(payment.amount).toLocaleString(
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
                                    {formatDate(payment.payment_date)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground truncate max-w-[180px] block">
                                    {payment.notes || "—"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit(payment)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => onDelete(payment)}
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
