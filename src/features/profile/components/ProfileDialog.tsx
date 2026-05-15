import { Loader2, UserRound } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UserPhotoField } from "@/shared/components/UserPhotoField";
import { useProfileForm } from "../hooks/useProfileForm";

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

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* ── Foto + Nome ──────────────────────────────────── */}
                        <div className="flex items-start gap-5">
                            <UserPhotoField
                                photoPreview={photoPreview}
                                fileInputRef={fileInputRef}
                                onPhotoChange={(file: File) => {
                                    setPhotoFile(file);
                                    setPhotoPreview(URL.createObjectURL(file));
                                }}
                                onPhotoRemove={resetPhoto}
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
                            </div>
                        </div>

                        <Separator className="bg-border" />

                        {/* ── Contato ──────────────────────────────────────── */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Contato
                            </p>
                            <div className="grid grid-cols-2 gap-3">
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
                </Form>
            </DialogContent>
        </Dialog>
    );
}
