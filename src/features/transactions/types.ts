export type {
    Transaction,
    TransactionType,
    TransactionStatus,
} from "./schemas/transactionSchema";

export interface TransactionCreate {
    type: "income" | "expense" | "transfer";
    description: string;
    amount: string;
    transaction_date: string;
    status: "pending" | "paid" | "cancelled";
    account?: number | null;
    credit_card?: number | null;
    category?: number | null;
    notes?: string;
}

export interface TransactionUpdate {
    type?: "income" | "expense" | "transfer";
    description?: string;
    amount?: string;
    transaction_date?: string;
    status?: "pending" | "paid" | "cancelled";
    account?: number | null;
    credit_card?: number | null;
    category?: number | null;
    notes?: string;
}

export interface TransactionFilters {
    type?: string;
    status?: string;
    account?: number;
    credit_card?: number;
    category?: number;
    description?: string;
    transaction_date_after?: string;
    transaction_date_before?: string;
    [key: string]: unknown;
}
