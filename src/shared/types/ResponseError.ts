export type ResponseError = {
    detail?: string;
    code?: string;
    [field: string]: string | string[] | undefined;
};
