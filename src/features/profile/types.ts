export type { ProfileUser } from "./schemas/profileUserSchema";

export interface ProfileUpdate {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    photo?: File;
}

export interface ChangePassword {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
