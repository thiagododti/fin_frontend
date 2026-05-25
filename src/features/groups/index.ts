// ─── Types ───────────────────────────────────────────────────────────────
export type { Group, GroupCreate, GroupUpdate, GroupFilters } from "./types";

// ─── Hooks ────────────────────────────────────────────────────────────────
export {
    useGroups,
    useGroup,
    useCreateGroup,
    useUpdateGroup,
    useDeleteGroup,
} from "./hooks/useGroupQueries";
export { useGroupForm } from "./hooks/useGroupForm";
export type { GroupFormData } from "./hooks/useGroupForm";

// ─── Filters ──────────────────────────────────────────────────────────────
export { groupNameFilter } from "./filters";
