import type { FilterField } from "@/shared/types/filters";

export const transactionTypeFilter: FilterField = {
    key: "type",
    label: "Tipo",
    type: "select",
    options: [
        { label: "Receita", value: "income" },
        { label: "Despesa", value: "expense" },
        { label: "Transferência", value: "transfer" },
    ],
    placeholder: "Todos os tipos",
};

export const transactionStatusFilter: FilterField = {
    key: "status",
    label: "Status",
    type: "select",
    options: [
        { label: "Pendente", value: "pending" },
        { label: "Pago", value: "paid" },
        { label: "Cancelado", value: "cancelled" },
    ],
    placeholder: "Todos",
};

export const transactionDescriptionFilter: FilterField = {
    key: "description",
    label: "Descrição",
    type: "text",
    placeholder: "Buscar por descrição",
};

export const transactionDateAfterFilter: FilterField = {
    key: "transaction_date_after",
    label: "Data inicial",
    type: "text",
    placeholder: "AAAA-MM-DD",
};

export const transactionDateBeforeFilter: FilterField = {
    key: "transaction_date_before",
    label: "Data final",
    type: "text",
    placeholder: "AAAA-MM-DD",
};
