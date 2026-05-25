import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useTransfers,
    useDeleteTransfer,
} from "@/features/transfers/hooks/useTransferQueries";
import type { TransferFilters } from "@/features/transfers/types";
import type { Transfer } from "@/features/transfers/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { TransferDialog } from "@/features/transfers/components/TransferDialog";
import { TransferTable } from "@/features/transfers/components/TransferTable";
import {
    transferDescriptionFilter,
    transferSourceAccountFilter,
    transferDestinationAccountFilter,
    transferDateAfterFilter,
    transferDateBeforeFilter,
} from "@/features/transfers/filters";
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
    transferDescriptionFilter,
    transferSourceAccountFilter,
    transferDestinationAccountFilter,
    transferDateAfterFilter,
    transferDateBeforeFilter,
];

export default function TransfersPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<TransferFilters>();
    const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(
        null,
    );
    const [deletingTransfer, setDeletingTransfer] = useState<Transfer | null>(
        null,
    );

    const { data, isLoading } = useTransfers(filters, page);
    const deleteMutation = useDeleteTransfer();

    const handleDialogSuccess = () => {
        setEditingTransfer(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingTransfer) return;
        await deleteMutation.mutateAsync(deletingTransfer.id, {
            onSuccess: () => {
                toast.success("Transferência removida com sucesso.");
                setDeletingTransfer(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover transferência."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Transferências
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar transferências entre contas
                    </p>
                </div>
                <TransferDialog
                    editData={editingTransfer || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingTransfer(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <TransferTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingTransfer}
                onDelete={setDeletingTransfer}
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
                open={!!deletingTransfer}
                onOpenChange={(v) => !v && setDeletingTransfer(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remover transferência
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a transferência{" "}
                            <strong>{deletingTransfer?.description}</strong>?
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
