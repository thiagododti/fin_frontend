export type Tokens = {
    access: string;
    refresh: string;
};

export type RefreshTokenType = {
    refresh: string;
};

export type TokenBody = {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: string;
};
