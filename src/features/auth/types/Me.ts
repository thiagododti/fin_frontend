export type Me = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    photo: string;
};

export type MeUpdate = {
    first_name?: string;
    last_name?: string;
    email?: string;
    birth_date?: string;
    photo?: File | null;
};