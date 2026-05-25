import { useState, useEffect } from "react";
import { useGroupMemberForm } from "../hooks/useGroupMemberForm";
import type { GroupMember } from "../types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Loader2, Plus, UserPlus } from "lucide-react";
import { useGroups } from "@/features/groups/hooks/useGroupQueries";
import { useUsers } from "@/features/users/hooks/useUserQueries";

interface GroupMemberDialogProps {
    editData?: GroupMember;
    onSuccess?: () => void;
    onClose?: () => void;
}

const roleLabels: Record<string, string> = {
    owner: "Dono",
    admin: "Admin",
    member: "Membro",
};

export function GroupMemberDialog({
    editData,
    onSuccess,
    onClose,
}: GroupMemberDialogProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (editData) setOpen(true);
    }, [editData]);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    const {
        createForm,
        editForm,
        isEditing,
        onDialogClose,
        isLoading,
        onSubmitCreate,
        onSubmitEdit,
    } = useGroupMemberForm({
        editData,
        onSuccess: handleSuccess,
        onClose,
    });

    const handleOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) onDialogClose();
    };

    const { data: groupsData } = useGroups(undefined, 1);
    const { data: usersData } = useUsers(undefined, 1);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Membro
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border sm:max-w-[440px]">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg">
                        <UserPlus className="h-5 w-5 text-primary" />
                        {isEditing ? "Editar Membro" : "Novo Membro"}
                    </DialogTitle>
                </DialogHeader>

                {isEditing ? (
                    <Form {...editForm}>
                        <form
                            onSubmit={onSubmitEdit}
                            className="space-y-4 py-1"
                        >
                            <FormField
                                control={editForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Papel{" "}
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
                                                    <SelectValue placeholder="Selecione o papel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="owner">
                                                    Dono
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value="member">
                                                    Membro
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <Form {...createForm}>
                        <form
                            onSubmit={onSubmitCreate}
                            className="space-y-4 py-1"
                        >
                            <FormField
                                control={createForm.control}
                                name="group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Grupo{" "}
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
                                                    <SelectValue placeholder="Selecione o grupo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {groupsData?.results.map(
                                                    (g) => (
                                                        <SelectItem
                                                            key={g.id}
                                                            value={g.id}
                                                        >
                                                            {g.name}
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
                                control={createForm.control}
                                name="user"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Usuário{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(v) =>
                                                field.onChange(Number(v))
                                            }
                                            value={
                                                field.value
                                                    ? String(field.value)
                                                    : ""
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary border-border">
                                                    <SelectValue placeholder="Selecione o usuário" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {usersData?.results.map((u) => (
                                                    <SelectItem
                                                        key={u.id}
                                                        value={String(u.id)}
                                                    >
                                                        {u.first_name ||
                                                        u.last_name
                                                            ? `${u.first_name} ${u.last_name}`.trim()
                                                            : u.username}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={createForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">
                                            Papel{" "}
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
                                                    <SelectValue placeholder="Selecione o papel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="owner">
                                                    Dono
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value="member">
                                                    Membro
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    Criar
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

export { roleLabels };
