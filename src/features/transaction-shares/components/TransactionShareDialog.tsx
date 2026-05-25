import { useState, useEffect } from "react";
import { useTransactionShareForm } from "../hooks/useTransactionShareForm";
import type { TransactionShare } from "../types";
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
import { Loader2, Plus, Split } from "lucide-react";
import { useTransactions } from "@/features/transactions/hooks/useTransactionQueries";
import { useGroupMembers } from "@/features/group-members/hooks/useGroupMemberQueries";

interface TransactionShareDialogProps {
    editData?: TransactionShare;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function TransactionShareDialog({
    editData,
    onSuccess,
    onClose,
}: TransactionShareDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const { form, onDialogClose, isLoading, onSubmit } =
        useTransactionShareForm({
            editData,
            onSuccess: handleSuccess,
            onClose,
        });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    const isEditing = !!editData;

    const { data: transactionsData } = useTransactions(undefined, 1);
    const { data: groupMembersData } = useGroupMembers(undefined, 1);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Rateio
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[480px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <Split className="h-5 w-5 text-primary" />
                        {isEditing ? "Editar Rateio" : "Novo Rateio"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4 py-1">
                        <FormField
                            control={form.control}
                            name="transaction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Transação{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <Select
                                        disabled={isEditing}
                                        onValueChange={(v) =>
                                            field.onChange(Number(v))
                                        }
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : undefined
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-secondary border-border">
                                                <SelectValue placeholder="Selecione a transação" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {transactionsData?.results.map(
                                                (t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={String(t.id)}
                                                    >
                                                        #{t.id} —{" "}
                                                        {t.description}
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
                            name="group_member"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Membro do Grupo{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FormLabel>
                                    <Select
                                        disabled={isEditing}
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-secondary border-border">
                                                <SelectValue placeholder="Selecione o membro" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {groupMembersData?.results.map(
                                                (m) => (
                                                    <SelectItem
                                                        key={m.id}
                                                        value={m.id}
                                                    >
                                                        Membro #{m.user} —{" "}
                                                        {m.id.slice(0, 8)}…
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
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
                                                placeholder="90.45"
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
                                                <SelectItem value="partially_paid">
                                                    Parcialmente pago
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
                                {isEditing ? "Salvar" : "Criar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
