// ─── Types ───────────────────────────────────────────────────────────────
export type {
    Category,
    CategoryType,
    CategoryCreate,
    CategoryUpdate,
    CategoryFilters,
} from "./types";

// ─── Hooks ────────────────────────────────────────────────────────────────
export {
    useCategories,
    useCategory,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from "./hooks/useCategoryQueries";
export { useCategoryForm } from "./hooks/useCategoryForm";
export type { CategoryFormData } from "./hooks/useCategoryForm";

// ─── Filters ──────────────────────────────────────────────────────────────
export { categoryNameFilter, categoryTypeFilter } from "./filters";
