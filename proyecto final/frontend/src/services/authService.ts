import { AuthResponseDTO, AuthUserDTO } from '../types/user';
import { apiRequest } from './api';

export const authService = {
  login(email: string, password: string) {
    return apiRequest<AuthResponseDTO>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  getProfile() {
    return apiRequest<AuthUserDTO>('/auth/me');
  },
};
