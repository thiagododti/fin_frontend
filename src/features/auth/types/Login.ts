import type { loginSchema } from "@/features/auth/login-schema";

export type Login = {
    username: string;
    password: string;
};


type LoginForm = z.infer<typeof loginSchema>;