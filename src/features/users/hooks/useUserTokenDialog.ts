import { useMemo, useState } from "react";
import { useAuth } from "@/features/auth/hooks";
import { copyClipboard } from "@/lib/copyClipboardHttp";
import { useToken, useCreateToken, useRegenerateToken } from "../hooks";
import type { User } from "../types";

export function useUserTokenDialog(user: User) {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { user: authenticatedUser } = useAuth();
    const tokenQuery = useToken(user.id, open);
    const createToken = useCreateToken();
    const regenerateToken = useRegenerateToken();

    const token = tokenQuery.data;
    const canManageToken = !!authenticatedUser?.is_staff;
    const isMutating = createToken.isPending || regenerateToken.isPending;

    const dialogTitle = useMemo(() => {
        const fullName = `${user.first_name} ${user.last_name}`.trim();
        return fullName || user.username;
    }, [user.first_name, user.last_name, user.username]);

    const handleCreateToken = async () => {
        setErrorMessage(null);
        try {
            await createToken.mutateAsync({ user_id: user.id });
        } catch {
            setErrorMessage("Nao foi possivel criar o token deste usuario.");
        }
    };

    const handleRegenerateToken = async () => {
        setErrorMessage(null);
        try {
            await regenerateToken.mutateAsync({ user_id: user.id });
        } catch {
            setErrorMessage(
                "Nao foi possivel regenerar o token deste usuario.",
            );
        }
    };

    const handleCopy = () => {
        if (!token?.key) return;
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            copyClipboard(token.key);
            setSuccessMessage("Token copiado para a area de transferencia.");
        } catch {
            setErrorMessage("Nao foi possivel copiar o token.");
        }
    };

    return {
        open,
        setOpen,
        errorMessage,
        successMessage,
        tokenQuery,
        token,
        canManageToken,
        isMutating,
        isCreating: createToken.isPending,
        isRegenerating: regenerateToken.isPending,
        dialogTitle,
        handleCreateToken,
        handleRegenerateToken,
        handleCopy,
    };
}
