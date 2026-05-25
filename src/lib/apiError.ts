import { isAxiosError } from "axios";

function extractMessage(value: unknown): string | null {
    if (!value) return null;

    if (typeof value === "string") {
        const message = value.trim();
        return message.length > 0 ? message : null;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const message = extractMessage(item);
            if (message) return message;
        }
        return null;
    }

    if (typeof value === "object") {
        const record = value as Record<string, unknown>;

        const prioritizedKeys = ["detail", "message", "error", "errors"];
        for (const key of prioritizedKeys) {
            const message = extractMessage(record[key]);
            if (message) return message;
        }

        for (const nestedValue of Object.values(record)) {
            const message = extractMessage(nestedValue);
            if (message) return message;
        }
    }

    return null;
}

/**
 * Extrai uma mensagem legível de um erro de requisição.
 *
 * Suporta os formatos de resposta da API:
 *   - { "detail": "mensagem" }
 *   - { "campo": ["mensagem de validação"] }
 *   - { "campo": "mensagem de validação" }
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!isAxiosError(error)) return fallback;

    const messageFromData = extractMessage(error.response?.data);
    if (messageFromData) return messageFromData;

    const messageFromError = extractMessage(error.message);
    if (messageFromError) return messageFromError;

    return fallback;
}
