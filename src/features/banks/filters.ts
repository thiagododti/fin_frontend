import type { FilterField } from "@/shared/types/filters";

export const bankNameFilter: FilterField = {
    key: "name",
    label: "Nome",
    type: "text",
    placeholder: "Buscar por nome",
};

export const bankCodeFilter: FilterField = {
    key: "code",
    label: "Código",
    type: "text",
    placeholder: "Buscar por código",
};
