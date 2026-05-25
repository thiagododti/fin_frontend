export type { Group } from "./schemas/groupSchema";

export interface GroupCreate {
    name: string;
}

export interface GroupUpdate {
    name?: string;
}

export interface GroupFilters {
    name?: string;
    [key: string]: unknown;
}
