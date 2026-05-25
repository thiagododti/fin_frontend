import { useState, useEffect } from "react";
import { useCreditCardForm } from "../hooks/useCreditCardForm";
import type { CreditCard } from "../types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, CreditCard as CreditCardIcon } from "lucide-react";
import { useBanks } from "@/features/banks/hooks/useBankQueries";

interface CreditCardDialogProps {
    editData?: CreditCard;
    onSuccess?: () => void;
    onClose?: () => void;
}

const days = Array.from({ length: 31 }, (_, i) => i + 1);

export function CreditCardDialog({
    editData,
    onSuccess,
    onClose,
}: CreditCardDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const { form, onDialogClose, isLoading, onSubmit } = useCreditCardForm({
        editData,
        onSuccess: handleSuccess,
        onClose,
    });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    const { data: banksData } = useBanks(undefined, 1);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cartão
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[500px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <CreditCardIcon className="h-5 w-5 text-primary" />
                        {editData ? "Editar Cartão" : "Novo Cartão"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4 py-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Nome{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Visa Platinum"
                                            className="bg-secondary border-border"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bank"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Banco
                                    </FormLabel>
                                    <Select
                                        onValueChange={(v) =>
                                            field.onChange(
                                                v === "none" ? null : Number(v),
                                            )
                                        }
                                        value={
                                            field.value != null
                                                ? String(field.value)
                                                : "none"
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-secondary border-border">
                                                <SelectValue placeholder="Nenhum banco" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Nenhum banco
                                            </SelectItem>
                                            {banksData?.results.map((bank) => (
                                                <SelectItem
                                                    key={bank.id}
                                                    value={String(bank.id)}
                                                >
                                                    {bank.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="limit_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Limite{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="5000.00"
                                            className="bg-secondary border-border font-mono"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="closing_day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Dia de fechamento{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(v) =>
                                                field.onChange(Number(v))
                                            }
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary border-border">
                                                    <SelectValue placeholder="Dia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {days.map((d) => (
                                                    <SelectItem
                                                        key={d}
                                                        value={String(d)}
                                                    >
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="due_day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Dia de vencimento{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(v) =>
                                                field.onChange(Number(v))
                                            }
                                            value={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary border-border">
                                                    <SelectValue placeholder="Dia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {days.map((d) => (
                                                    <SelectItem
                                                        key={d}
                                                        value={String(d)}
                                                    >
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-3">
                                    <FormLabel className="text-sm text-foreground cursor-pointer">
                                        Cartão ativo
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value ?? true}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editData ? "Salvar" : "Criar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
