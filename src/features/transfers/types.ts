export type { Transfer } from "./schemas/transferSchema";

export interface TransferCreate {
    source_account: number;
    destination_account: number;
    amount: string;
    transfer_date: string;
    description: string;
}

export interface TransferUpdate {
    source_account?: number;
    destination_account?: number;
    amount?: string;
    transfer_date?: string;
    description?: string;
}

export interface TransferFilters {
    source_account?: number;
    destination_account?: number;
    description?: string;
    transfer_date_after?: string;
    transfer_date_before?: string;
    [key: string]: unknown;
}
