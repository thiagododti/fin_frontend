import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useAccounts,
    useDeleteAccount,
} from "@/features/accounts/hooks/useAccountQueries";
import type { AccountFilters } from "@/features/accounts/types";
import type { Account } from "@/features/accounts/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { AccountDialog } from "@/features/accounts/components/AccountDialog";
import { AccountTable } from "@/features/accounts/components/AccountTable";
import {
    accountNameFilter,
    accountTypeFilter,
    accountStatusFilter,
} from "@/features/accounts/filters";
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
    accountNameFilter,
    accountTypeFilter,
    accountStatusFilter,
];

export default function AccountsPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<AccountFilters>();
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [deletingAccount, setDeletingAccount] = useState<Account | null>(
        null,
    );

    const { data, isLoading } = useAccounts(filters, page);
    const deleteMutation = useDeleteAccount();

    const handleDialogSuccess = () => {
        setEditingAccount(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingAccount) return;
        await deleteMutation.mutateAsync(deletingAccount.id, {
            onSuccess: () => {
                toast.success("Conta removida com sucesso.");
                setDeletingAccount(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover conta."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Contas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar contas financeiras
                    </p>
                </div>
                <AccountDialog
                    editData={editingAccount || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingAccount(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <AccountTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingAccount}
                onDelete={setDeletingAccount}
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
                open={!!deletingAccount}
                onOpenChange={(v) => !v && setDeletingAccount(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover conta</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a conta{" "}
                            <strong>{deletingAccount?.name}</strong>? Esta ação
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
