import { fetchApi } from '../../client';
import { API_ENDPOINTS } from '../../client';
import type { LoginResponse } from '@/types/auth';

/**
 * ユーザー情報取得
 */
export const getUserById = async (userId: number): Promise<LoginResponse> => {
  return fetchApi<LoginResponse>(`${API_ENDPOINTS.USER}/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
};
