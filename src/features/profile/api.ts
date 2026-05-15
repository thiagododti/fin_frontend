import api from "@/lib/axios";
import type { User } from "@/features/users/types";
import type { ProfileUpdate, ProfileUser, ChangePassword } from "./types";

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
    me: () => api.get<User>("/api/users/me/"),

    updateMe: (data: ProfileUpdate) =>
        api.patch<ProfileUser>("/api/users/me/", buildProfileFormData(data), {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    changePassword: (data: ChangePassword) =>
        api.post("/api/users/change-password/", data),
};
