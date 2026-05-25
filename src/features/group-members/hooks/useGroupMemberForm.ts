import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";
import {
    useCreateGroupMember,
    useUpdateGroupMember,
} from "./useGroupMemberQueries";
import {
    groupMemberFormSchema,
    groupMemberEditFormSchema,
    type GroupMemberFormData,
    type GroupMemberEditFormData,
    defaultValues,
} from "../schemas/groupMemberFormSchema";
import type { GroupMember } from "../types";

export type { GroupMemberFormData, GroupMemberEditFormData };

interface UseGroupMemberFormProps {
    editData?: GroupMember;
    onSuccess?: () => void;
    onClose?: () => void;
}

export function useGroupMemberForm({
    editData,
    onSuccess,
    onClose,
}: UseGroupMemberFormProps) {
    const isEditing = !!editData;
    const createMutation = useCreateGroupMember();
    const updateMutation = useUpdateGroupMember();

    const createForm = useForm<GroupMemberFormData>({
        resolver: zodResolver(groupMemberFormSchema),
        defaultValues,
    });

    const editForm = useForm<GroupMemberEditFormData>({
        resolver: zodResolver(groupMemberEditFormSchema),
        defaultValues: { role: "member" },
    });

    const form = isEditing ? editForm : createForm;

    useEffect(() => {
        if (editData) {
            editForm.reset({ role: editData.role });
        }
    }, [editData, editForm]);

    const onDialogClose = () => {
        createForm.reset(defaultValues);
        editForm.reset({ role: "member" });
        onClose?.();
    };

    const submitCreateHandler = async (data: GroupMemberFormData) => {
        await createMutation.mutateAsync(
            { group: data.group, user: data.user, role: data.role },
            {
                onSuccess: () => {
                    toast.success("Membro adicionado com sucesso.");
                    createForm.reset(defaultValues);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(error, "Erro ao adicionar membro."),
                    );
                },
            },
        );
    };

    const submitEditHandler = async (data: GroupMemberEditFormData) => {
        if (!editData) return;
        await updateMutation.mutateAsync(
            { id: editData.id, data: { role: data.role } },
            {
                onSuccess: () => {
                    toast.success("Papel atualizado com sucesso.");
                    onSuccess?.();
                },
                onError: (error) => {
                    toast.error(
                        getApiErrorMessage(error, "Erro ao atualizar membro."),
                    );
                },
            },
        );
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return {
        createForm,
        editForm,
        form,
        isEditing,
        onDialogClose,
        isLoading,
        onSubmitCreate: createForm.handleSubmit(submitCreateHandler),
        onSubmitEdit: editForm.handleSubmit(submitEditHandler),
    };
}
