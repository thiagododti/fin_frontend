import { useState } from "react";
import { toast } from "sonner";
import { useTableState } from "@/shared/hooks/useTableState";
import {
    useCategories,
    useDeleteCategory,
} from "@/features/categories/hooks/useCategoryQueries";
import type { CategoryFilters } from "@/features/categories/types";
import type { Category } from "@/features/categories/types";
import { PaginationControls } from "@/shared/components/PaginationControls";
import { FilterBar } from "@/shared/components/FilterBar";
import { CategoryDialog } from "@/features/categories/components/CategoryDialog";
import { CategoryTable } from "@/features/categories/components/CategoryTable";
import {
    categoryNameFilter,
    categoryTypeFilter,
} from "@/features/categories/filters";
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

const filterFields = [categoryNameFilter, categoryTypeFilter];

export default function CategoriesPage() {
    const { filters, page, setPage, handleFilter, handleClear } =
        useTableState<CategoryFilters>();
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(
        null,
    );

    const { data, isLoading } = useCategories(filters, page);
    const deleteMutation = useDeleteCategory();

    const handleDialogSuccess = () => {
        setEditingCategory(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingCategory) return;
        await deleteMutation.mutateAsync(deletingCategory.id, {
            onSuccess: () => {
                toast.success("Categoria removida com sucesso.");
                setDeletingCategory(null);
            },
            onError: (error) => {
                toast.error(
                    getApiErrorMessage(error, "Erro ao remover categoria."),
                );
            },
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Categorias
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerenciar categorias de receitas e despesas
                    </p>
                </div>
                <CategoryDialog
                    editData={editingCategory || undefined}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setEditingCategory(null)}
                />
            </div>

            <FilterBar
                fields={filterFields}
                onFilter={handleFilter}
                onClear={handleClear}
            />

            <CategoryTable
                data={data}
                isLoading={isLoading}
                onEdit={setEditingCategory}
                onDelete={setDeletingCategory}
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
                open={!!deletingCategory}
                onOpenChange={(v) => !v && setDeletingCategory(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover categoria</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover a categoria{" "}
                            <strong>{deletingCategory?.name}</strong>? Esta ação
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
