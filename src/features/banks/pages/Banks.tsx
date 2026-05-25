import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import { useBanks, useDeleteBank } from "@/features/banks/hooks/useBankQueries";
import type { BankFilters } from "@/features/banks/types";
import type { Bank } from "@/features/banks/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { BankDialog } from "@/features/banks/components/BankDialog";
import { BankTable } from "@/features/banks/components/BankTable";
import { bankNameFilter, bankCodeFilter } from "@/features/banks/filters";
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

const filterFields = [bankNameFilter, bankCodeFilter];

export default function BanksPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<BankFilters>();
    const [editingBank, setEditingBank] = useState<Bank | null>(null);
    const [deletingBank, setDeletingBank] = useState<Bank | null>(null);

    const { data, isLoading } = useBanks(filters, page);
    const deleteMutation = useDeleteBank();

    const handleDialogSuccess = () => {
        setEditingBank(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingBank) return;
        await deleteMutation.mutateAsync(deletingBank.id, {
            onSuccess: () => {
                toast.success("Banco removido com sucesso.");
                setDeletingBank(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover banco."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Bancos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar bancos cadastrados no sistema
                    </p>
                </div>
                <BankDialog
                    editData={editingBank || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingBank(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <BankTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingBank}
                onDelete={setDeletingBank}
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
                open={!!deletingBank}
                onOpenChange={(v) => !v && setDeletingBank(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover banco</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o banco{" "}
                            <strong>{deletingBank?.name}</strong>? Esta ação não
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
