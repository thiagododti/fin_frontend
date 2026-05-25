import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useGroupMembers,
    useDeleteGroupMember,
} from "@/features/group-members/hooks/useGroupMemberQueries";
import type { GroupMemberFilters } from "@/features/group-members/types";
import type { GroupMember } from "@/features/group-members/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { GroupMemberDialog } from "@/features/group-members/components/GroupMemberDialog";
import { GroupMemberTable } from "@/features/group-members/components/GroupMemberTable";
import { groupMemberRoleFilter } from "@/features/group-members/filters";
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

const filterFields = [groupMemberRoleFilter];

export default function GroupMembersPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<GroupMemberFilters>();
    const [editingMember, setEditingMember] = useState<GroupMember | null>(
        null,
    );
    const [deletingMember, setDeletingMember] = useState<GroupMember | null>(
        null,
    );

    const { data, isLoading } = useGroupMembers(filters, page);
    const deleteMutation = useDeleteGroupMember();

    const handleDialogSuccess = () => {
        setEditingMember(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingMember) return;
        await deleteMutation.mutateAsync(deletingMember.id, {
            onSuccess: () => {
                toast.success("Membro removido com sucesso.");
                setDeletingMember(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover membro."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Membros de Grupo
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar membros dos grupos cadastrados
                    </p>
                </div>
                <GroupMemberDialog
                    editData={editingMember || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingMember(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <GroupMemberTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingMember}
                onDelete={setDeletingMember}
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
                open={!!deletingMember}
                onOpenChange={(v) => !v && setDeletingMember(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover membro</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover este membro do grupo?
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
