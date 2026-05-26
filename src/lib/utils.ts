import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(value: string | null): string {
    if (!value) return "\u2014";
    try {
        return format(parseISO(value), "dd/MM/yyyy");
    } catch {
        return "\u2014";
    }
}

export function getInitials(
    firstName: string,
    lastName: string,
    username: string,
): string {
    if (firstName || lastName) {
        return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
}
