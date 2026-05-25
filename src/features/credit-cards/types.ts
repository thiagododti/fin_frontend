export type { CreditCard } from "./schemas/creditCardSchema";

export interface CreditCardCreate {
    name: string;
    bank?: number | null;
    limit_amount: string;
    closing_day: number;
    due_day: number;
    is_active?: boolean;
}

export interface CreditCardUpdate {
    name?: string;
    bank?: number | null;
    limit_amount?: string;
    closing_day?: number;
    due_day?: number;
    is_active?: boolean;
}

export interface CreditCardFilters {
    name?: string;
    bank?: number;
    is_active?: boolean;
    closing_day?: number;
    due_day?: number;
    [key: string]: unknown;
}
