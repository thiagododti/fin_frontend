import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Loader2, UserRound, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks";
import { usersApi } from "../api";

const profileSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    birth_date: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            birth_date: "",
        },
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = form;

    useEffect(() => {
        if (open && user) {
            reset({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                email: user.email ?? "",
                birth_date: user.birth_date ?? "",
            });
            setPhotoPreview(user.photo ?? null);
            setPhotoFile(undefined);
        }
    }, [open, user, reset]);

    const mutation = useMutation({
        mutationFn: (values: ProfileFormValues) => {
            if (!user) throw new Error("Usuário não autenticado");
            const payload: Record<string, unknown> = { ...values };
            if (photoFile) payload.photo = photoFile;
            return usersApi.patch(
                user.id,
                payload as unknown as Parameters<typeof usersApi.patch>[1],
            );
        },
        onSuccess: ({ data }) => {
            updateUser(data);
            toast.success("Perfil atualizado com sucesso!");
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Erro ao atualizar perfil. Tente novamente.");
        },
    });

    const onSubmit = handleSubmit((values) => mutation.mutate(values));

    const handleOpenChange = (v: boolean) => {
        if (!mutation.isPending) onOpenChange(v);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[520px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <UserRound className="h-5 w-5 text-primary" />
                        Editar Perfil
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* ── Foto + Nome ──────────────────────────────────── */}
                    <div className="flex items-start gap-5">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={photoPreview ?? undefined}
                                    />
                                    <AvatarFallback className="bg-secondary text-muted-foreground">
                                        <UserRound className="h-9 w-9" />
                                    </AvatarFallback>
                                </Avatar>
                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhotoPreview(null);
                                            setPhotoFile(undefined);
                                            if (fileInputRef.current)
                                                fileInputRef.current.value = "";
                                        }}
                                        className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground hover:bg-destructive/80"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPhotoFile(file);
                                        setPhotoPreview(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-border bg-secondary hover:bg-secondary/80 text-xs px-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="mr-1.5 h-3 w-3" />
                                {photoPreview ? "Alterar" : "Foto"}
                            </Button>
                            <p className="text-[10px] text-muted-foreground text-center leading-tight">
                                JPG, PNG
                                <br />
                                Máx. 5MB
                            </p>
                        </div>

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
                                    disabled
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

                    <Separator className="bg-border" />

                    {/* ── Contato ──────────────────────────────────────── */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Contato
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-sm text-foreground">
                                    Nascimento
                                </Label>
                                <Input
                                    type="date"
                                    {...register("birth_date")}
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Salvar Alterações
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
