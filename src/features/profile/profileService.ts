import { api } from "@/lib/axios";
import type { ProfileUpdate, ChangePassword } from "./types";
import {
    profileUserSchema,
    type ProfileUser,
} from "./schemas/profileUserSchema";

function buildProfileFormData(data: ProfileUpdate): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value instanceof File ? value : String(value));
        }
    });
    return formData;
}

export const profileApi = {
    me: async (): Promise<ProfileUser> => {
        const res = await api.get("/api/users/me/");
        return profileUserSchema.parse(res.data);
    },

    updateMe: async (data: ProfileUpdate): Promise<ProfileUser> => {
        const res = await api.patch(
            "/api/users/me/",
            buildProfileFormData(data),
            {
                headers: { "Content-Type": "multipart/form-data" },
            },
        );
        return profileUserSchema.parse(res.data);
    },

    changePassword: async (data: ChangePassword): Promise<void> => {
        await api.post("/api/users/change-password/", data);
    },
};
