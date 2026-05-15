import { Badge } from "@/components/ui/badge";

interface EfficiencyBadgeProps {
    value: string;
}

export function EfficiencyBadge({ value }: EfficiencyBadgeProps) {
    const num = parseFloat(value);
    const colorClass =
        num >= 100
            ? "text-green-500 bg-green-500/10 border-transparent hover:bg-green-500/15"
            : num >= 50
              ? "text-yellow-500 bg-yellow-500/10 border-transparent hover:bg-yellow-500/15"
              : "text-destructive bg-destructive/10 border-transparent hover:bg-destructive/15";
    return (
        <Badge
            variant="outline"
            className={`font-mono tabular-nums ${colorClass}`}
        >
            {isNaN(num) ? value : `${num.toFixed(1)}%`}
        </Badge>
    );
}
