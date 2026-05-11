import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { usersApi } from '../api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z
    .object({
        current_password: z.string().min(1, 'Senha atual é obrigatória'),
        new_password: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
        confirm_password: z.string().min(1, 'Confirme a nova senha'),
    })
    .refine((d) => d.new_password === d.confirm_password, {
        message: 'As senhas não coincidem',
        path: ['confirm_password'],
    });

type FormData = z.infer<typeof schema>;

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const { mutate, isPending } = useMutation({
        mutationFn: usersApi.changePassword,
        onSuccess: () => {
            toast.success('Senha alterada com sucesso!');
            reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Falha ao alterar senha. Verifique a senha atual e tente novamente.');
        },
    });

    const onSubmit = (data: FormData) => mutate(data);

    const handleOpenChange = (v: boolean) => {
        if (!v) reset();
        onOpenChange(v);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[420px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="flex items-center gap-2 text-foreground">
                        <KeyRound className="h-5 w-5 text-primary" />
                        Alterar Senha
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
                    {/* Senha Atual */}
                    <div className="space-y-1.5">
                        <Label className="text-foreground text-sm">Senha atual</Label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="bg-secondary border-border pr-10"
                                {...register('current_password')}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowCurrent((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.current_password && (
                            <p className="text-xs text-destructive">{errors.current_password.message}</p>
                        )}
                    </div>

                    <div className="my-1 border-t border-border" />

                    {/* Nova senha */}
                    <div className="space-y-1.5">
                        <Label className="text-foreground text-sm">Nova senha</Label>
                        <div className="relative">
                            <Input
                                type={showNew ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="bg-secondary border-border pr-10"
                                {...register('new_password')}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowNew((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.new_password && (
                            <p className="text-xs text-destructive">{errors.new_password.message}</p>
                        )}
                    </div>

                    {/* Confirmar nova senha */}
                    <div className="space-y-1.5">
                        <Label className="text-foreground text-sm">Confirmar nova senha</Label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="bg-secondary border-border pr-10"
                                {...register('confirm_password')}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirm_password && (
                            <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Alterar Senha
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
