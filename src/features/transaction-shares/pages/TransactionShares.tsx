import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useTransactionShares,
    useDeleteTransactionShare,
} from "@/features/transaction-shares/hooks/useTransactionShareQueries";
import type { TransactionShareFilters } from "@/features/transaction-shares/types";
import type { TransactionShare } from "@/features/transaction-shares/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { TransactionShareDialog } from "@/features/transaction-shares/components/TransactionShareDialog";
import { TransactionShareTable } from "@/features/transaction-shares/components/TransactionShareTable";
import {
    transactionShareStatusFilter,
    transactionShareTransactionFilter,
    transactionShareGroupMemberFilter,
    transactionShareCreatedAfterFilter,
    transactionShareCreatedBeforeFilter,
} from "@/features/transaction-shares/filters";
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
    transactionShareTransactionFilter,
    transactionShareGroupMemberFilter,
    transactionShareStatusFilter,
    transactionShareCreatedAfterFilter,
    transactionShareCreatedBeforeFilter,
];

export default function TransactionSharesPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<TransactionShareFilters>();
    const [editingShare, setEditingShare] = useState<TransactionShare | null>(
        null,
    );
    const [deletingShare, setDeletingShare] = useState<TransactionShare | null>(
        null,
    );

    const { data, isLoading } = useTransactionShares(filters, page);
    const deleteMutation = useDeleteTransactionShare();

    const handleDialogSuccess = () => {
        setEditingShare(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingShare) return;
        await deleteMutation.mutateAsync(deletingShare.id, {
            onSuccess: () => {
                toast.success("Rateio removido com sucesso.");
                setDeletingShare(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover rateio."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Rateios
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar rateios de transações entre membros
                    </p>
                </div>
                <TransactionShareDialog
                    editData={editingShare || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingShare(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <TransactionShareTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingShare}
                onDelete={setDeletingShare}
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
                open={!!deletingShare}
                onOpenChange={(v) => !v && setDeletingShare(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover rateio</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o rateio{" "}
                            <strong>#{deletingShare?.id}</strong>? Esta ação não
                            pode ser desfeita.
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
