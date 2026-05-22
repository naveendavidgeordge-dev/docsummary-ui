import client from './client';
import { ApiSuccess, User } from '@/types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (data: any) => client.post<any, ApiSuccess<AuthResponse>>('/auth/login', data),
  register: (data: any) => client.post<any, ApiSuccess<AuthResponse>>('/auth/register', data),
};
