import { useState } from "react";

export function useTableState<TFilters extends Record<string, unknown>>(
    initialFilters?: TFilters,
) {
    // única assertion necessária: {} satisfaz TFilters em runtime (todos os campos são opcionais nos filtros)
    const empty = {} as TFilters;
    const [filters, setFilters] = useState<TFilters>(initialFilters ?? empty);
    const [page, setPage] = useState(1);

    const handleFilter = (v: Record<string, unknown>) => {
        // narrowing legítimo: v vem do FilterBar com os mesmos campos de TFilters
        setFilters(v as TFilters);
        setPage(1);
    };

    const handleClear = () => {
        setFilters(initialFilters ?? empty);
        setPage(1);
    };

    return { filters, page, setPage, handleFilter, handleClear };
}
