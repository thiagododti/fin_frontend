export type {
    TransactionShare,
    TransactionShareStatus,
} from "./schemas/transactionShareSchema";

export interface TransactionShareCreate {
    transaction: number;
    group_member: string;
    amount: string;
    status: "pending" | "partially_paid" | "paid" | "cancelled";
}

export interface TransactionShareUpdate {
    amount?: string;
    status?: "pending" | "partially_paid" | "paid" | "cancelled";
}

export interface TransactionShareFilters {
    transaction?: number;
    group_member?: string;
    status?: string;
    created_after?: string;
    created_before?: string;
    [key: string]: unknown;
}
