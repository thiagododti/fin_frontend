import { useState, useEffect } from "react";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { Transaction } from "../types";
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
import { Loader2, Plus, ArrowLeftRight } from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks/useAccountQueries";
import { useCreditCards } from "@/features/credit-cards/hooks/useCreditCardQueries";
import { useCategories } from "@/features/categories/hooks/useCategoryQueries";

interface TransactionDialogProps {
    editData?: Transaction;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function TransactionDialog({
    editData,
    onSuccess,
    onClose,
}: TransactionDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const { form, onDialogClose, isLoading, onSubmit } = useTransactionForm({
        editData,
        onSuccess: handleSuccess,
        onClose,
    });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    const { data: accountsData } = useAccounts({ is_active: true }, 1);
    const { data: creditCardsData } = useCreditCards({ is_active: true }, 1);
    const { data: categoriesData } = useCategories(undefined, 1);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Transação
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                        {editData ? "Editar Transação" : "Nova Transação"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4 py-1">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Tipo{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary border-border">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="income">
                                                    Receita
                                                </SelectItem>
                                                <SelectItem value="expense">
                                                    Despesa
                                                </SelectItem>
                                                <SelectItem value="transfer">
                                                    Transferência
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Status{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary border-border">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    Pendente
                                                </SelectItem>
                                                <SelectItem value="paid">
                                                    Pago
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelado
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Descrição{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Supermercado"
                                            className="bg-secondary border-border"
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
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Valor{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="180.90"
                                                className="bg-secondary border-border font-mono"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="transaction_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Data{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="bg-secondary border-border"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="account"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Conta
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
                                                <SelectValue placeholder="Nenhuma conta" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Nenhuma conta
                                            </SelectItem>
                                            {accountsData?.results.map((a) => (
                                                <SelectItem
                                                    key={a.id}
                                                    value={String(a.id)}
                                                >
                                                    {a.name}
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
                            name="credit_card"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Cartão de Crédito
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
                                                <SelectValue placeholder="Nenhum cartão" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Nenhum cartão
                                            </SelectItem>
                                            {creditCardsData?.results.map(
                                                (c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={String(c.id)}
                                                    >
                                                        {c.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Categoria
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
                                                <SelectValue placeholder="Nenhuma categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Nenhuma categoria
                                            </SelectItem>
                                            {categoriesData?.results.map(
                                                (c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={String(c.id)}
                                                    >
                                                        {c.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Observações
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Observações opcionais"
                                            className="bg-secondary border-border"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
