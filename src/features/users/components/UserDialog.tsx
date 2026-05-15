import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    Plus,
    UserRound,
    ShieldCheck,
    CircleCheck,
    Key,
} from "lucide-react";
import { UserPhotoField } from "./UserPhotoField";
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

    const {
        register,
        control,
        formState: { errors },
    } = form;

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
                    <form onSubmit={onSubmit} className="space-y-6 py-1 pr-3">
                        {/* ── Perfil ─────────────────────────────────────── */}
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Perfil
                            </p>

                            {/* Avatar + campos principais lado a lado */}
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <UserPhotoField
                                    photoPreview={photoPreview}
                                    fileInputRef={fileInputRef}
                                    onPhotoChange={(file) => {
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

                                {/* Campos principais */}
                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-foreground">
                                                Nome
                                            </Label>
                                            <Input
                                                {...register("first_name")}
                                                placeholder="Nome"
                                                className="bg-secondary border-border"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-foreground">
                                                Sobrenome
                                            </Label>
                                            <Input
                                                {...register("last_name")}
                                                placeholder="Sobrenome"
                                                className="bg-secondary border-border"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-foreground">
                                            Email
                                        </Label>
                                        <Input
                                            type="email"
                                            {...register("email")}
                                            placeholder="email@exemplo.com"
                                            className="bg-secondary border-border"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-destructive">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* ── Contato & Organização ──────────────────────── */}
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Contato & Organização
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">
                                        Telefone
                                    </Label>
                                    <Input
                                        {...register("telephone")}
                                        placeholder="(00) 00000-0000"
                                        className="bg-secondary border-border"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground">
                                        Nascimento
                                    </Label>
                                    <Input
                                        type="date"
                                        {...register("birthday")}
                                        className="bg-secondary border-border"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* ── Permissões ─────────────────────────────────── */}
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Permissões
                            </p>
                            <div className="flex flex-row gap-3 justify-around">
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <CircleCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Usuário Ativo
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Permite o acesso ao sistema
                                            </p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="is_active"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Acesso Staff
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Acesso ao painel administrativo
                                            </p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="is_staff"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Superusuário
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Acesso total ao sistema
                                            </p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="is_superuser"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* ── Segurança ──────────────────────────────────── */}
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Segurança
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground flex items-center gap-1.5">
                                        Usuário{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        {...register("username")}
                                        placeholder="Nome de usuário"
                                        className="bg-secondary border-border"
                                    />
                                    {errors.username && (
                                        <p className="text-xs text-destructive">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground flex items-center gap-1.5">
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
                                    </Label>
                                    <Input
                                        type="password"
                                        {...register("password")}
                                        placeholder={
                                            editData ? "••••••••" : "Nova senha"
                                        }
                                        className="bg-secondary border-border"
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-destructive">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-foreground flex items-center gap-1.5">
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
                                    </Label>
                                    <Input
                                        type="password"
                                        {...register("password2")}
                                        placeholder={
                                            editData
                                                ? "••••••••"
                                                : "Confirme a senha"
                                        }
                                        className="bg-secondary border-border"
                                    />
                                    {errors.password2 && (
                                        <p className="text-xs text-destructive">
                                            {errors.password2.message}
                                        </p>
                                    )}
                                </div>
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
                            {editData ? "Salvar Alterações" : "Criar Usuário"}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
