import { api } from "@/lib/axios";
import {
    profileUserSchema,
    type ProfileUser,
} from "@/shared/types/profileUser";

export async function fetchMe(): Promise<ProfileUser | null> {
    try {
        const res = await api.get("/api/users/me/");
        return profileUserSchema.parse(res.data);
    } catch {
        return null;
    }
}
