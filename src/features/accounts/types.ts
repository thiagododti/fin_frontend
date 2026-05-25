export type { Account, AccountType } from "./schemas/accountSchema";

export interface AccountCreate {
    name: string;
    account_type: "checking" | "savings" | "cash" | "investment" | "wallet";
    bank?: number | null;
    initial_balance?: string;
    is_active?: boolean;
}

export interface AccountUpdate {
    name?: string;
    account_type?: "checking" | "savings" | "cash" | "investment" | "wallet";
    bank?: number | null;
    initial_balance?: string;
    is_active?: boolean;
}

export interface AccountFilters {
    name?: string;
    account_type?: string;
    bank?: number;
    is_active?: boolean;
    [key: string]: unknown;
}
