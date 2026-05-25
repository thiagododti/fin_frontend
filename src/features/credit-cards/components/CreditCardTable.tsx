import { Loader2, CreditCard as CreditCardIcon } from "lucide-react";
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
import type { CreditCard } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

interface CreditCardTableProps {
    data: PaginatedResponse<CreditCard> | undefined;
    isLoading: boolean;
    onEdit: (card: CreditCard) => void;
    onDelete: (card: CreditCard) => void;
}

export function CreditCardTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: CreditCardTableProps) {
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
                            Cartão
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Limite
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Fechamento
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Vencimento
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
                                Nenhum cartão encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((card) => (
                        <TableRow key={card.id} className="border-border">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                                        <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        {card.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-mono text-foreground">
                                    {Number(card.limit_amount).toLocaleString(
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
                                    Dia {card.closing_day}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-foreground">
                                    Dia {card.due_day}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={
                                        card.is_active
                                            ? "bg-success/15 text-success border-transparent"
                                            : "bg-muted text-muted-foreground border-transparent"
                                    }
                                >
                                    {card.is_active ? "Ativo" : "Inativo"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit(card)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => onDelete(card)}
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
