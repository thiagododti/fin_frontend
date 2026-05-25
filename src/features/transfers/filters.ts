import type { FilterField } from "@/shared/types/filters";

export const transferDescriptionFilter: FilterField = {
    key: "description",
    label: "Descrição",
    type: "text",
    placeholder: "Buscar por descrição",
};

export const transferSourceAccountFilter: FilterField = {
    key: "source_account",
    label: "Conta de origem (ID)",
    type: "text",
    placeholder: "Ex: 2",
};

export const transferDestinationAccountFilter: FilterField = {
    key: "destination_account",
    label: "Conta de destino (ID)",
    type: "text",
    placeholder: "Ex: 5",
};

export const transferDateAfterFilter: FilterField = {
    key: "transfer_date_after",
    label: "Data inicial",
    type: "text",
    placeholder: "AAAA-MM-DD",
};

export const transferDateBeforeFilter: FilterField = {
    key: "transfer_date_before",
    label: "Data final",
    type: "text",
    placeholder: "AAAA-MM-DD",
};
