function isFile(value: unknown): value is File {
    return typeof File !== 'undefined' && value instanceof File;
}

function isBlob(value: unknown): value is Blob {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

function isFormData(value: unknown): value is FormData {
    return typeof FormData !== 'undefined' && value instanceof FormData;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export function hasBinary(value: unknown): boolean {
    if (!value) return false;

    if (isFile(value) || isBlob(value)) return true;

    if (Array.isArray(value)) {
        return value.some((item) => hasBinary(item));
    }

    if (isPlainObject(value)) {
        return Object.values(value).some((item) => hasBinary(item));
    }

    return false;
}

function appendFormData(formData: FormData, key: string, value: unknown): void {
    if (value === null || value === undefined) {
        return;
    }

    if (isFile(value) || isBlob(value)) {
        formData.append(key, value);
        return;
    }

    if (isDate(value)) {
        formData.append(key, value.toISOString());
        return;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        formData.append(key, String(value));
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            appendFormData(formData, `${key}[${index}]`, item);
        });
        return;
    }

    if (isPlainObject(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            appendFormData(formData, `${key}[${nestedKey}]`, nestedValue);
        });
    }
}

export function toFormData(data: Record<string, unknown>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        appendFormData(formData, key, value);
    });

    return formData;
}

export function shouldConvertToFormData(data: unknown): data is Record<string, unknown> {
    if (!data) return false;
    if (isFormData(data)) return false;
    if (!isPlainObject(data)) return false;

    return hasBinary(data);
}
