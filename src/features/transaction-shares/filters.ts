import type { FilterField } from "@/shared/types/filters";

export const transactionShareStatusFilter: FilterField = {
    key: "status",
    label: "Status",
    type: "select",
    options: [
        { label: "Pendente", value: "pending" },
        { label: "Parcialmente pago", value: "partially_paid" },
        { label: "Pago", value: "paid" },
        { label: "Cancelado", value: "cancelled" },
    ],
    placeholder: "Todos",
};

export const transactionShareTransactionFilter: FilterField = {
    key: "transaction",
    label: "Transação (ID)",
    type: "text",
    placeholder: "Ex: 15",
};

export const transactionShareGroupMemberFilter: FilterField = {
    key: "group_member",
    label: "Membro (UUID)",
    type: "text",
    placeholder: "UUID do membro",
};

export const transactionShareCreatedAfterFilter: FilterField = {
    key: "created_after",
    label: "Criado após",
    type: "text",
    placeholder: "AAAA-MM-DD",
};

export const transactionShareCreatedBeforeFilter: FilterField = {
    key: "created_before",
    label: "Criado antes",
    type: "text",
    placeholder: "AAAA-MM-DD",
};
