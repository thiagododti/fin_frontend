import { useContext } from "react";
import type { AuthContextType } from "@/features/auth/types";
import { AuthContext } from "@/features/auth/context";

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
}
