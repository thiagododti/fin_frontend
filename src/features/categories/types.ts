export type { Category, CategoryType } from "./schemas/categorySchema";

export interface CategoryCreate {
    name: string;
    type: "income" | "expense";
    color?: string;
    icon?: string;
}

export interface CategoryUpdate {
    name?: string;
    type?: "income" | "expense";
    color?: string;
    icon?: string;
}

export interface CategoryFilters {
    name?: string;
    type?: "income" | "expense";
    [key: string]: unknown;
}
