import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FallbackProps } from "react-error-boundary";

export function SectionErrorFallback({ resetErrorBoundary }: FallbackProps) {
    return (
        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">
                    Algo deu errado
                </p>
                <p className="text-sm text-muted-foreground">
                    Ocorreu um erro inesperado nesta seção.
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={resetErrorBoundary}
                className="gap-2"
            >
                <RefreshCw className="h-3.5 w-3.5" />
                Tentar novamente
            </Button>
        </div>
    );
}
