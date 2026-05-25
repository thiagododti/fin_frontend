import type { FilterField } from "@/shared/types/filters";

export const sharePaymentTransactionShareFilter: FilterField = {
    key: "transaction_share",
    label: "Rateio (ID)",
    type: "text",
    placeholder: "Ex: 4",
};

export const sharePaymentDateAfterFilter: FilterField = {
    key: "payment_date_after",
    label: "Pago após",
    type: "text",
    placeholder: "AAAA-MM-DD",
};

export const sharePaymentDateBeforeFilter: FilterField = {
    key: "payment_date_before",
    label: "Pago antes",
    type: "text",
    placeholder: "AAAA-MM-DD",
};
