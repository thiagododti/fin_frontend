import type { FilterField } from "@/shared/types/filters";

export const accountNameFilter: FilterField = {
    key: "name",
    label: "Nome",
    type: "text",
    placeholder: "Buscar por nome",
};

export const accountTypeFilter: FilterField = {
    key: "account_type",
    label: "Tipo",
    type: "select",
    options: [
        { label: "Conta Corrente", value: "checking" },
        { label: "Poupança", value: "savings" },
        { label: "Dinheiro", value: "cash" },
        { label: "Investimento", value: "investment" },
        { label: "Carteira", value: "wallet" },
    ],
    placeholder: "Todos os tipos",
};

export const accountStatusFilter: FilterField = {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
        { label: "Ativa", value: "true" },
        { label: "Inativa", value: "false" },
    ],
    placeholder: "Todos",
};
