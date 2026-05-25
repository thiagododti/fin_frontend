export type { SharePayment } from "./schemas/sharePaymentSchema";

export interface SharePaymentCreate {
    transaction_share: number;
    amount: string;
    payment_date: string;
    notes?: string;
}

export interface SharePaymentUpdate {
    amount?: string;
    payment_date?: string;
    notes?: string;
}

export interface SharePaymentFilters {
    transaction_share?: number;
    payment_date_after?: string;
    payment_date_before?: string;
    [key: string]: unknown;
}
