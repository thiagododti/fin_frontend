import { useState, useEffect } from "react";
import { useTransferForm } from "../hooks/useTransferForm";
import type { Transfer } from "../types";
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
import { Loader2, Plus, MoveRight } from "lucide-react";
import { useAccounts } from "@/features/accounts/hooks/useAccountQueries";

interface TransferDialogProps {
    editData?: Transfer;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function TransferDialog({
    editData,
    onSuccess,
    onClose,
}: TransferDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const { form, onDialogClose, isLoading, onSubmit } = useTransferForm({
        editData,
        onSuccess: handleSuccess,
        onClose,
    });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    const isEditing = !!editData;

    const { data: accountsData } = useAccounts({ is_active: true }, 1);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Transferência
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[480px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <MoveRight className="h-5 w-5 text-primary" />
                        {isEditing
                            ? "Editar Transferência"
                            : "Nova Transferência"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4 py-1">
                        <FormField
                            control={form.control}
                            name="source_account"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Conta de Origem{" "}
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
                                                <SelectValue placeholder="Selecione a conta de origem" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                            name="destination_account"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Conta de Destino{" "}
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
                                                <SelectValue placeholder="Selecione a conta de destino" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                                            placeholder="Ex: Transferência para reserva"
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
                                                placeholder="300.00"
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
                                name="transfer_date"
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
