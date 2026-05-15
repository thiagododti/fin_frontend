export interface User {
    id: number;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    birth_date: string | null;
    photo: string | null;
}

export interface UserCreate {
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
}

export interface UserUpdate extends Omit<UserCreate, "password"> {
    password?: string;
    password2?: string;
}

export interface UserFilters {
    username?: string;
    email?: string;
    full_name?: string;
    [key: string]: unknown;
}

export interface UserEditData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telephone?: string | null;
    birth_date?: string | null;
    department?: number | null;
    is_active?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    photo?: string | null;
}
