import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
    iniciado: {
        label: "Iniciado",
        className:
            "bg-primary/15 text-primary border-transparent hover:bg-primary/20",
    },
    concluido: {
        label: "Concluído",
        className:
            "bg-success/15 text-success border-transparent hover:bg-success/20",
    },
    erro: {
        label: "Erro",
        className:
            "bg-destructive/15 text-destructive border-transparent hover:bg-destructive/20",
    },
    alerta: {
        label: "Alerta",
        className:
            "bg-warning/15 text-warning border-transparent hover:bg-warning/20",
    },
    teste: {
        label: "Teste",
        className:
            "bg-accent/15 text-accent border-transparent hover:bg-accent/20",
    },
};

export function StatusBadge({ status }: { status: string }) {
    const config = statusConfig[status] || {
        label: status,
        className: "bg-muted text-muted-foreground border-transparent",
    };

    return (
        <Badge variant="outline" className={config.className}>
            {config.label}
        </Badge>
    );
}
