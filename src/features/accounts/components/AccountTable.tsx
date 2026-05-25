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
import type { Account, AccountType } from "../types";
import type { PaginatedResponse } from "@/shared/types/api";

const accountTypeLabels: Record<AccountType, string> = {
    checking: "Conta Corrente",
    savings: "Poupança",
    cash: "Dinheiro",
    investment: "Investimento",
    wallet: "Carteira",
};

interface AccountTableProps {
    data: PaginatedResponse<Account> | undefined;
    isLoading: boolean;
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
}

export function AccountTable({
    data,
    isLoading,
    onEdit,
    onDelete,
}: AccountTableProps) {
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
                            Saldo Inicial
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            Status
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
                                colSpan={6}
                                className="py-10 text-center text-sm text-muted-foreground"
                            >
                                Nenhuma conta encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.results.map((account) => (
                        <TableRow key={account.id} className="border-border">
                            <TableCell>
                                <span className="text-sm font-medium text-foreground">
                                    {account.name}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {accountTypeLabels[account.account_type]}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-mono text-foreground">
                                    R${" "}
                                    {parseFloat(
                                        account.initial_balance,
                                    ).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        account.is_active
                                            ? "border-transparent bg-success/15 text-success"
                                            : "border-transparent bg-muted text-muted-foreground"
                                    }
                                >
                                    {account.is_active ? "Ativa" : "Inativa"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(account.created_at)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        onClick={() => onEdit(account)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => onDelete(account)}
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
