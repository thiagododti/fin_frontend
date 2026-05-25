import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useTransactions,
    useDeleteTransaction,
} from "@/features/transactions/hooks/useTransactionQueries";
import type { TransactionFilters } from "@/features/transactions/types";
import type { Transaction } from "@/features/transactions/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { TransactionDialog } from "@/features/transactions/components/TransactionDialog";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import {
    transactionTypeFilter,
    transactionStatusFilter,
    transactionDescriptionFilter,
    transactionDateAfterFilter,
    transactionDateBeforeFilter,
} from "@/features/transactions/filters";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const filterFields = [
    transactionDescriptionFilter,
    transactionTypeFilter,
    transactionStatusFilter,
    transactionDateAfterFilter,
    transactionDateBeforeFilter,
];

export default function TransactionsPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<TransactionFilters>();
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);
    const [deletingTransaction, setDeletingTransaction] =
        useState<Transaction | null>(null);

    const { data, isLoading } = useTransactions(filters, page);
    const deleteMutation = useDeleteTransaction();

    const handleDialogSuccess = () => {
        setEditingTransaction(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingTransaction) return;
        await deleteMutation.mutateAsync(deletingTransaction.id, {
            onSuccess: () => {
                toast.success("Transação removida com sucesso.");
                setDeletingTransaction(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover transação."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Transações
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar movimentações financeiras
                    </p>
                </div>
                <TransactionDialog
                    editData={editingTransaction || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingTransaction(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <TransactionTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingTransaction}
                onDelete={setDeletingTransaction}
            />

            {data && (
                <div className="px-4">
                    <PaginationControls
                        count={data.count}
                        page={page}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <AlertDialog
                open={!!deletingTransaction}
                onOpenChange={(v) => !v && setDeletingTransaction(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover transação</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a transação{" "}
                            <strong>{deletingTransaction?.description}</strong>?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
