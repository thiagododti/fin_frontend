import { useState, useEffect } from "react";
import { useCategoryForm } from "../hooks/useCategoryForm";
import type { Category } from "../types";
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
import { Loader2, Plus, Tag } from "lucide-react";

interface CategoryDialogProps {
    editData?: Category;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function CategoryDialog({
    editData,
    onSuccess,
    onClose,
}: CategoryDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const { form, onDialogClose, isLoading, onSubmit } = useCategoryForm({
        editData,
        onSuccess: handleSuccess,
        onClose,
    });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[500px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <Tag className="h-5 w-5 text-primary" />
                        {editData ? "Editar Categoria" : "Nova Categoria"}
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
                                            placeholder="Ex: Salário"
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
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="income">
                                                Receita
                                            </SelectItem>
                                            <SelectItem value="expense">
                                                Despesa
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Cor
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: #4CAF50"
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
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-foreground">
                                        Ícone
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: wallet"
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
