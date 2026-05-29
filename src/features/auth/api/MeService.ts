import type { Me, MeUpdate } from '@/features/auth/types/Me';
import { api } from '@/shared/api/client';
import { handleService } from '@/shared/utils/handle-service';
import { USER_ENDPOINTS } from '@/shared/constants/endpoints';

export function getMe() {
    return handleService(() => api.get<Me>(USER_ENDPOINTS.ME));
}

export function updateMe(data: MeUpdate) {
    return handleService(() => api.patch<Me>(USER_ENDPOINTS.ME, data));
}
