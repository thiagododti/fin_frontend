import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useCreditCards,
    useDeleteCreditCard,
} from "@/features/credit-cards/hooks/useCreditCardQueries";
import type { CreditCardFilters } from "@/features/credit-cards/types";
import type { CreditCard } from "@/features/credit-cards/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { CreditCardDialog } from "@/features/credit-cards/components/CreditCardDialog";
import { CreditCardTable } from "@/features/credit-cards/components/CreditCardTable";
import {
    creditCardNameFilter,
    creditCardStatusFilter,
} from "@/features/credit-cards/filters";
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

const filterFields = [creditCardNameFilter, creditCardStatusFilter];

export default function CreditCardsPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<CreditCardFilters>();
    const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
    const [deletingCard, setDeletingCard] = useState<CreditCard | null>(null);

    const { data, isLoading } = useCreditCards(filters, page);
    const deleteMutation = useDeleteCreditCard();

    const handleDialogSuccess = () => {
        setEditingCard(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingCard) return;
        await deleteMutation.mutateAsync(deletingCard.id, {
            onSuccess: () => {
                toast.success("Cartão removido com sucesso.");
                setDeletingCard(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover cartão."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Cartões de Crédito
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar cartões de crédito cadastrados no sistema
                    </p>
                </div>
                <CreditCardDialog
                    editData={editingCard || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingCard(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <CreditCardTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingCard}
                onDelete={setDeletingCard}
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
                open={!!deletingCard}
                onOpenChange={(v) => !v && setDeletingCard(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover cartão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o cartão{" "}
                            <strong>{deletingCard?.name}</strong>? Esta ação não
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
