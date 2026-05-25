import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useSharePayments,
    useDeleteSharePayment,
} from "@/features/share-payments/hooks/useSharePaymentQueries";
import type { SharePaymentFilters } from "@/features/share-payments/types";
import type { SharePayment } from "@/features/share-payments/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { SharePaymentDialog } from "@/features/share-payments/components/SharePaymentDialog";
import { SharePaymentTable } from "@/features/share-payments/components/SharePaymentTable";
import {
    sharePaymentTransactionShareFilter,
    sharePaymentDateAfterFilter,
    sharePaymentDateBeforeFilter,
} from "@/features/share-payments/filters";
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
    sharePaymentTransactionShareFilter,
    sharePaymentDateAfterFilter,
    sharePaymentDateBeforeFilter,
];

export default function SharePaymentsPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<SharePaymentFilters>();
    const [editingPayment, setEditingPayment] = useState<SharePayment | null>(
        null,
    );
    const [deletingPayment, setDeletingPayment] = useState<SharePayment | null>(
        null,
    );

    const { data, isLoading } = useSharePayments(filters, page);
    const deleteMutation = useDeleteSharePayment();

    const handleDialogSuccess = () => {
        setEditingPayment(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingPayment) return;
        await deleteMutation.mutateAsync(deletingPayment.id, {
            onSuccess: () => {
                toast.success("Pagamento removido com sucesso.");
                setDeletingPayment(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover pagamento."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Pagamentos de Rateio
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar pagamentos vinculados a rateios
                    </p>
                </div>
                <SharePaymentDialog
                    editData={editingPayment || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingPayment(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <SharePaymentTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingPayment}
                onDelete={setDeletingPayment}
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
                open={!!deletingPayment}
                onOpenChange={(v) => !v && setDeletingPayment(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover pagamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o pagamento{" "}
                            <strong>#{deletingPayment?.id}</strong>? Esta ação
                            não pode ser desfeita.
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
