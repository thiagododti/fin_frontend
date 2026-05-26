import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FallbackProps } from "react-error-boundary";

export function RootErrorPage({ resetErrorBoundary }: FallbackProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-semibold text-foreground">
                    Algo deu errado
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ocorreu um erro inesperado na aplicação. Tente recarregar a
                    página.
                </p>
            </div>
            <Button
                variant="outline"
                onClick={resetErrorBoundary}
                className="gap-2"
            >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
            </Button>
        </div>
    );
}
