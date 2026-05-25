import type { FilterField } from "@/shared/types/filters";

export const creditCardNameFilter: FilterField = {
    key: "name",
    label: "Nome",
    type: "text",
    placeholder: "Buscar por nome",
};

export const creditCardStatusFilter: FilterField = {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
        { label: "Ativo", value: "true" },
        { label: "Inativo", value: "false" },
    ],
    placeholder: "Todos",
};
