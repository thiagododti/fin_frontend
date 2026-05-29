import type { loginSchema } from "@/features/auth/login-schema";

export type Login = {
    username: string;
    password: string;
};


export type LoginForm = z.infer<typeof loginSchema>;