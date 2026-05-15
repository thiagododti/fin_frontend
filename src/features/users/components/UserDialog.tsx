import { useState, useEffect } from "react";
import { useUserForm } from "../hooks";
import type { UserEditData } from "../hooks";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Loader2,
    Plus,
    UserRound,
    ShieldCheck,
    CircleCheck,
    Key,
} from "lucide-react";
import { UserPhotoField } from "@/shared/components/UserPhotoField";

interface UserDialogProps {
    onSuccess?: () => void;
    onClose?: () => void;
    editData?: UserEditData;
}

export function UserDialog({ onSuccess, onClose, editData }: UserDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const {
        form,
        onDialogClose,
        isLoading,
        photoPreview,
        setPhotoPreview,
        setPhotoFile,
        fileInputRef,
        onSubmit,
    } = useUserForm({ open, editData, onSuccess: handleSuccess, onClose });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[900px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <UserRound className="h-5 w-5 text-primary" />
                        {editData ? "Editar Usuário" : "Novo Usuário"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[78vh] pr-1">
                    <Form {...form}>
                        <form
                            onSubmit={onSubmit}
                            className="space-y-6 py-1 pr-3"
                        >
                            {/* â”€â”€ Perfil â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Perfil
                                </p>

                                <div className="flex items-start gap-6">
                                    <UserPhotoField
                                        photoPreview={photoPreview}
                                        fileInputRef={fileInputRef}
                                        onPhotoChange={(file: File) => {
                                            setPhotoFile(file);
                                            setPhotoPreview(
                                                URL.createObjectURL(file),
                                            );
                                        }}
                                        onPhotoRemove={() => {
                                            setPhotoPreview(null);
                                            setPhotoFile(undefined);
                                            if (fileInputRef.current)
                                                fileInputRef.current.value = "";
                                        }}
                                    />

                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="first_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm text-foreground">
                                                            Nome
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Nome"
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
                                                name="last_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm text-foreground">
                                                            Sobrenome
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Sobrenome"
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm text-foreground">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="email@exemplo.com"
                                                            className="bg-secondary border-border"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            {/* â”€â”€ Contato & Organização â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Contato & Organização
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="telephone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-foreground">
                                                    Telefone
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="(00) 00000-0000"
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
                                        name="birth_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-foreground">
                                                    Nascimento
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
                            </div>

                            <Separator className="bg-border" />

                            {/* â”€â”€ Permissões â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Permissões
                                </p>
                                <div className="flex flex-row gap-3 justify-around">
                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 w-full">
                                                <div className="flex items-center gap-3">
                                                    <CircleCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            Usuário Ativo
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Permite o acesso ao
                                                            sistema
                                                        </p>
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="is_staff"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 w-full">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            Acesso Staff
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Acesso ao painel
                                                            administrativo
                                                        </p>
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="is_superuser"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3 w-full">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            Superusuário
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Acesso total ao
                                                            sistema
                                                        </p>
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            {/* â”€â”€ Segurança â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                            <div className="space-y-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Segurança
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-foreground flex items-center gap-1.5">
                                                    Usuário{" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nome de usuário"
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-foreground flex items-center gap-1.5">
                                                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Senha{" "}
                                                    {editData ? (
                                                        <span className="text-muted-foreground font-normal normal-case tracking-normal">
                                                            (opcional)
                                                        </span>
                                                    ) : (
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder={
                                                            editData
                                                                ? "••••••••"
                                                                : "Nova senha"
                                                        }
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
                                        name="password2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-foreground flex items-center gap-1.5">
                                                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Confirmar Senha{" "}
                                                    {editData ? (
                                                        <span className="text-muted-foreground font-normal normal-case tracking-normal">
                                                            (opcional)
                                                        </span>
                                                    ) : (
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder={
                                                            editData
                                                                ? "••••••••"
                                                                : "Confirme a senha"
                                                        }
                                                        className="bg-secondary border-border"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-1"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editData
                                    ? "Salvar Alterações"
                                    : "Criar Usuário"}
                            </Button>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
