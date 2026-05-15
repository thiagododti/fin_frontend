import { Loader2, UserRound } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useProfileForm } from "../hooks/useProfileForm";
import { UserPhotoField } from "./UserPhotoField";

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
    const {
        form,
        onSubmit,
        isPending,
        photoPreview,
        setPhotoPreview,
        setPhotoFile,
        fileInputRef,
        resetPhoto,
    } = useProfileForm({ open, onClose: () => onOpenChange(false) });

    const {
        register,
        formState: { errors },
    } = form;

    const handleOpenChange = (v: boolean) => {
        if (!isPending) onOpenChange(v);
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
                        <UserPhotoField
                            photoPreview={photoPreview}
                            fileInputRef={fileInputRef}
                            onPhotoChange={(file) => {
                                setPhotoFile(file);
                                setPhotoPreview(URL.createObjectURL(file));
                            }}
                            onPhotoRemove={resetPhoto}
                        />

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
                        disabled={isPending}
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Salvar Alterações
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
