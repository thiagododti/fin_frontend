import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Remove todos os caracteres não-dígitos de uma string.
 * Ex: "12.345-67" → "1234567"
 */
export function onlyDigits(value: string): string {
    return value.replace(/\D/g, "");
}

export function formatDate(value: string | null): string {
    if (!value) return "—";
    try {
        return format(parseISO(value), "dd/MM/yyyy");
    } catch {
        return "—";
    }
}
