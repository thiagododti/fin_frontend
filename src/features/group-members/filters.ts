import type { FilterField } from "@/shared/types/filters";

export const groupMemberRoleFilter: FilterField = {
    key: "role",
    label: "Papel",
    type: "select",
    options: [
        { label: "Dono", value: "owner" },
        { label: "Admin", value: "admin" },
        { label: "Membro", value: "member" },
    ],
    placeholder: "Todos os papéis",
};
