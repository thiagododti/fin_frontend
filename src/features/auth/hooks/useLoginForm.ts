import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { getApiErrorMessage } from "@/lib/apiError";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";

export function useLoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const onSubmit = form.handleSubmit(async (data: LoginFormData) => {
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
    });

    return {
        form,
        onSubmit,
        isSubmitting: form.formState.isSubmitting,
    };
}
