import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(value: string | null): string {
    if (!value) return "—";
    try {
        return format(parseISO(value), "dd/MM/yyyy");
    } catch {
        return "—";
    }
}
