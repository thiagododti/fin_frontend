export interface ProfileUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string | null;
    photo: string | null;
}

export interface ProfileUpdate {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    photo?: File;
}

export type ChangePassword = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};
