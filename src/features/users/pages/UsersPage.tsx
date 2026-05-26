import { useState } from "react";
import { useTableState } from "@/shared/hooks/useTableState";
import { useUsers } from "@/features/users/hooks/useUserQueries";
import type { UserFilters, User } from "@/features/users/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { UserDialog } from "@/features/users/components/UserDialog";
import { UserTable } from "@/features/users/components/UserTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    userFullNameFilter,
    userEmailFilter,
    userUsernameFilter,
} from "@/features/users/filters";

const filterFields = [userFullNameFilter, userEmailFilter, userUsernameFilter];

export default function UsersPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<UserFilters>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, isLoading } = useUsers(filters, page);

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setEditingUser(null);
        setDialogOpen(false);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) setEditingUser(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Usuários
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar usuários do sistema
                    </p>
                </div>
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <UserTable
                data={data}
                isLoading={isLoading}
                onEdit={handleEditUser}
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

            <UserDialog
                open={dialogOpen}
                onOpenChange={handleDialogOpenChange}
                editData={editingUser ?? undefined}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}
