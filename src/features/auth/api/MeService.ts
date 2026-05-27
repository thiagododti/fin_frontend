import type { Me } from '@/features/auth/types/Me';
import { api } from '@/shared/api/client';
import { handleService } from '@/shared/api/utils/handle-service';
import { USER_ENDPOINTS } from '@/shared/constants/endpoints';

export async function getMe() {
    return handleService(api.get<Me>(USER_ENDPOINTS.ME));
}
