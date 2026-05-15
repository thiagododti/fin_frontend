import { useState } from "react";

export function useTableState<TFilters extends Record<string, unknown>>() {
    const [filters, setFilters] = useState<TFilters>({} as TFilters);
    const [page, setPage] = useState(1);

    const handleFilter = (v: Record<string, string>) => {
        setFilters(v as TFilters);
        setPage(1);
    };

    const handleClear = () => {
        setFilters({} as TFilters);
        setPage(1);
    };

    return { filters, page, setPage, handleFilter, handleClear };
}
