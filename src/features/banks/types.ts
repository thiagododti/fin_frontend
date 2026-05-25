export type { Bank } from "./schemas/bankSchema";

export interface BankCreate {
    name: string;
    code: string;
    logo_url?: string;
}

export interface BankUpdate {
    name?: string;
    code?: string;
    logo_url?: string;
}

export interface BankFilters {
    name?: string;
    code?: string;
    [key: string]: unknown;
}
