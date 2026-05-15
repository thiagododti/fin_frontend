import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.username, data.password);
            navigate("/dashboard", { replace: true });
        } catch {
            setError("root", {
                message: "Credenciais inválidas. Tente novamente.",
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="mx-auto h-12 w-12 object-contain"
                        />
                        Walletfy
                    </CardTitle>
                    <CardDescription>
                        Acesse sua conta para gerenciar suas finanças de forma
                        fácil e eficiente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {errors.root && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {errors.root.message}
                            </div>
                        )}

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username">
                                    Usuário
                                </FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    {...register("username")}
                                />
                                {errors.username && (
                                    <p className="text-xs text-destructive">
                                        {errors.username.message}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Senha
                                    </FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu sua senha?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Login
                                </Button>
                                <FieldDescription className="text-center">
                                    Não possui uma conta?{" "}
                                    <a href="#">Cadastre-se</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
