import type { User } from "./schemas/userSchema";

export type { User };

export type UserCreate = {
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password: string;
    password2?: string;
    birth_date?: string;
    photo?: File;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
};

export type UserUpdate = Omit<UserCreate, "password"> & {
    password?: string;
    password2?: string;
};

export type UserFilters = {
    username?: string;
    email?: string;
    full_name?: string;
    [key: string]: unknown;
};

export type UserEditData = Pick<
    User,
    | "id"
    | "username"
    | "email"
    | "first_name"
    | "last_name"
    | "birth_date"
    | "is_active"
    | "is_staff"
    | "is_superuser"
    | "photo"
>;
