// src/features/auth/pages/LoginPage.tsx
import { login } from '@/features/auth/api/AuthService';
import { getMe } from '@/features/auth/api/MeService';
import { setTokens } from '@/features/auth/storage/auth-storage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Login, LoginForm } from '@/features/auth/types/Login';
import type { AppError } from '@/shared/types/AppError';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { paths } from '@/routes/paths';
import { loginSchema } from '@/features/auth/login-schema';

export function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate, isPending, error } = useMutation<void, AppError, Login>({
        mutationFn: async (data) => {
            const tokens = await login(data);
            setTokens(tokens);
            const user = await getMe();
            signIn(user);
        },
        onSuccess: () => navigate(paths.home),
    });

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Entrar</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="username">Usuário</Label>
                            <Input
                                id="username"
                                autoComplete="username"
                                {...register('username')}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {error && <p className="text-sm text-destructive">{error.message}</p>}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
