import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useGroups,
    useDeleteGroup,
} from "@/features/groups/hooks/useGroupQueries";
import type { GroupFilters } from "@/features/groups/types";
import type { Group } from "@/features/groups/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { GroupDialog } from "@/features/groups/components/GroupDialog";
import { GroupTable } from "@/features/groups/components/GroupTable";
import { groupNameFilter } from "@/features/groups/filters";
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

const filterFields = [groupNameFilter];

export default function GroupsPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<GroupFilters>();
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);

    const { data, isLoading } = useGroups(filters, page);
    const deleteMutation = useDeleteGroup();

    const handleDialogSuccess = () => {
        setEditingGroup(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingGroup) return;
        await deleteMutation.mutateAsync(deletingGroup.id, {
            onSuccess: () => {
                toast.success("Grupo removido com sucesso.");
                setDeletingGroup(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover grupo."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Grupos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar grupos cadastrados no sistema
                    </p>
                </div>
                <GroupDialog
                    editData={editingGroup || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingGroup(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <GroupTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingGroup}
                onDelete={setDeletingGroup}
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
                open={!!deletingGroup}
                onOpenChange={(v) => !v && setDeletingGroup(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover grupo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover o grupo{" "}
                            <strong>{deletingGroup?.name}</strong>? Esta ação
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
