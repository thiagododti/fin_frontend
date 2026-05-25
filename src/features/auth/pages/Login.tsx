import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { getApiErrorMessage } from "@/lib/apiError";
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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.username, data.password);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            form.setError("root", {
                message: getApiErrorMessage(
                    error,
                    "Falha ao realizar login. Verifique as credenciais e tente novamente.",
                ),
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
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {form.formState.errors.root && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {form.formState.errors.root.message}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Usuário</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel>Senha</FormLabel>
                                                <a
                                                    href="#"
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                >
                                                    Esqueceu sua senha?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Login
                                </Button>
                                <p className="text-center text-sm text-muted-foreground">
                                    Não possui uma conta?{" "}
                                    <a
                                        href="#"
                                        className="underline-offset-4 hover:underline"
                                    >
                                        Cadastre-se
                                    </a>
                                </p>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
