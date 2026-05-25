import type { FilterField } from "@/shared/types/filters";

export const categoryNameFilter: FilterField = {
    key: "name",
    label: "Nome",
    type: "text",
    placeholder: "Buscar por nome",
};

export const categoryTypeFilter: FilterField = {
    key: "type",
    label: "Tipo",
    type: "select",
    options: [
        { label: "Receita", value: "income" },
        { label: "Despesa", value: "expense" },
    ],
    placeholder: "Todos os tipos",
};
